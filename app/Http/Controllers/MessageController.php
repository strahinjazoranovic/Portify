<?php
namespace App\Http\Controllers;

use Musonza\Chat\Chat;
use Musonza\Chat\Models\Conversation;
use Musonza\Chat\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    protected $chat;

    public function __construct(Chat $chat)
    {
        $this->chat = $chat;
    }

    // Get available users for starting a conversation
    public function getAvailableUsers()
    {
        return response()->json(
            User::query()
                ->where('id', '!=', auth()->id())
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
        );
    }

    // Start or get a direct conversation with a specific user
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = auth()->user();
        $targetUser = User::findOrFail($request->user_id);

        // Check if a direct conversation already exists between the two users
        $conversation = $this->chat->conversations()->between($user, $targetUser);

        if (!$conversation) {
            $conversation = $this->chat->makeDirect()->createConversation([$user, $targetUser]);
        }

        $conversation->load('participants.messageable');

        // Find the other participant
        $otherParticipant = $conversation->getParticipants()->first(function ($p) use ($user) {
            return $p->id !== $user->id;
        });

        return response()->json([
            'id' => $conversation->id,
            'participant' => $otherParticipant ? [
                'id' => $otherParticipant->id,
                'name' => $otherParticipant->name,
                'avatar' => $otherParticipant->avatar ?? null,
            ] : null,
            'last_message' => null,
            'updated_at' => $conversation->updated_at,
        ]);
    }

    // Send message to an existing conversation
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'conversation_id' => 'required|integer',
            'reply_to_id' => 'nullable|integer',
        ]);

        $user = auth()->user();
        $conversation = Conversation::findOrFail($request->conversation_id);

        // Build data payload for reply metadata
        $data = [];
        if ($request->reply_to_id) {
            $replyTo = Message::find($request->reply_to_id);
            if ($replyTo && $replyTo->conversation_id === $conversation->id) {
                $data['reply_to'] = [
                    'id' => $replyTo->id,
                    'body' => Str::limit($replyTo->body, 100),
                    'sender' => $replyTo->sender['name'] ?? 'Onbekend',
                ];
            }
        }

        $msg = $this->chat->message($request->message)
            ->from($user)
            ->to($conversation);

        if (!empty($data)) {
            $msg = $msg->data($data);
        }

        $message = $msg->send();

        return response()->json([
            'id' => $message->id,
            'body' => $message->body,
            'conversation_id' => $message->conversation_id,
            'is_sender' => true,
            'data' => $message->data,
            'reactions' => [],
            'created_at' => $message->created_at,
        ]);
    }

    // Edit a message (only the sender can edit)
    public function editMessage(Request $request, $messageId)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = auth()->user();
        $message = Message::findOrFail($messageId);

        // Verify the current user is the sender
        $participation = $message->conversation->participantFromSender($user);
        if (!$participation || $message->participation_id !== $participation->id) {
            return response()->json(['error' => 'Niet toegestaan'], 403);
        }

        $message->body = $request->message;
        $message->save();

        return response()->json([
            'id' => $message->id,
            'body' => $message->body,
        ]);
    }

    // Delete a message (soft-delete for the participant)
    public function deleteMessage($messageId)
    {
        $user = auth()->user();
        $message = Message::findOrFail($messageId);

        // Verify the current user is the sender
        $participation = $message->conversation->participantFromSender($user);
        if (!$participation || $message->participation_id !== $participation->id) {
            return response()->json(['error' => 'Niet toegestaan'], 403);
        }

        $message->trash($user);

        return response()->json(['status' => 'deleted']);
    }

    // Toggle a reaction on a message
    public function toggleReaction(Request $request, $messageId)
    {
        $request->validate([
            'reaction' => 'required|string|max:50',
        ]);

        $user = auth()->user();
        $message = Message::findOrFail($messageId);

        $result = $message->toggleReaction($user, $request->reaction);

        // Return updated reactions summary for this message
        $reactions = $this->getReactionsForMessage($message, $user);

        return response()->json([
            'added' => $result['added'],
            'reactions' => $reactions,
        ]);
    }

    // Helper: get reactions grouped by emoji with user info
    private function getReactionsForMessage(Message $message, $currentUser)
    {
        $reactions = $message->reactions()->get();
        $grouped = [];

        foreach ($reactions as $r) {
            $emoji = $r->reaction;
            if (!isset($grouped[$emoji])) {
                $grouped[$emoji] = [
                    'emoji' => $emoji,
                    'count' => 0,
                    'reacted_by_me' => false,
                ];
            }
            $grouped[$emoji]['count']++;
            if ($r->messageable_id === $currentUser->id) {
                $grouped[$emoji]['reacted_by_me'] = true;
            }
        }

        return array_values($grouped);
    }

    // Get conversations with participant info
    public function getConversations()
    {
        $user = auth()->user();

        $paginator = $this->chat->conversations()
            ->setParticipant($user)
            ->isDirect()
            ->get();

        $result = [];

        foreach ($paginator->items() as $item) {
            $conv = $item->conversation;
            if (!$conv) continue;

            $otherParticipant = null;
            foreach ($conv->participants as $p) {
                if ($p->messageable && $p->messageable->id !== $user->id) {
                    $otherParticipant = $p->messageable;
                    break;
                }
            }

            $result[] = [
                'id' => $conv->id,
                'participant' => $otherParticipant ? [
                    'id' => $otherParticipant->id,
                    'name' => $otherParticipant->name,
                    'avatar' => $otherParticipant->avatar ?? null,
                ] : null,
                'last_message' => $conv->last_message ? [
                    'body' => $conv->last_message->body,
                    'created_at' => $conv->last_message->created_at,
                ] : null,
                'updated_at' => $conv->updated_at,
            ];
        }

        return response()->json($result);
    }

    // Get messages for a conversation
    public function getMessages($conversationId)
    {
        $user = auth()->user();
        $conversation = Conversation::findOrFail($conversationId);

        $paginator = $this->chat->conversation($conversation)
            ->setParticipant($user)
            ->getMessages();

        // Enrich messages with reactions and reply data
        $enriched = collect($paginator->items())->map(function ($msg) use ($user) {
            $message = Message::with('reactions')->find($msg->id);
            $reactions = $message ? $this->getReactionsForMessage($message, $user) : [];

            return [
                'id' => $msg->id,
                'body' => $msg->body,
                'conversation_id' => $msg->conversation_id,
                'is_sender' => (bool) $msg->is_sender,
                'data' => $msg->data,
                'reactions' => $reactions,
                'created_at' => $msg->created_at,
            ];
        });

        return response()->json([
            'data' => $enriched,
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
        ]);
    }

    // Mark conversation as read
    public function markAsRead($conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        $this->chat->conversation($conversation)
            ->setParticipant(auth()->user())
            ->readAll();

        return response()->json(['status' => 'read']);
    }
}
