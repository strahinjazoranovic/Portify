<?php

namespace App\Http\Controllers;

use Musonza\Chat\Chat;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    protected $chat;

    public function __construct(Chat $chat)
    {
        $this->chat = $chat;
    }

    // Send message
    public function sendMessage(Request $request)
    {
        $user = auth()->user();
        $admin = User::where('role', 'Admin')->first();

        // Check if conversation exists
        $conversation = $this->chat->conversations()
            ->setParticipant($user)
            ->get()
            ->first();

        if (!$conversation) {
            $conversation = $this->chat->createConversation([$user, $admin])
                ->makeDirect()
                ->getConversation();
        }

        // Send message
        $message = $this->chat->message($request->message)
            ->from($user)
            ->to($conversation)
            ->send();

        return response()->json([
            'message' => $message
        ]);
    }

    // Get conversations
    public function getConversations()
    {
        $conversations = $this->chat->conversations()
            ->setParticipant(auth()->user())
            ->get();

        return response()->json($conversations);
    }

    // Get messages
    public function getMessages($conversationId)
    {
        $messages = $this->chat->conversation($conversationId)
            ->setParticipant(auth()->user())
            ->getMessages();

        return response()->json($messages);
    }

    // Mark as read
    public function markAsRead($conversationId)
    {
        $this->chat->conversation($conversationId)
            ->setParticipant(auth()->user())
            ->readAll();

        return response()->json(['status' => 'read']);
    }
}