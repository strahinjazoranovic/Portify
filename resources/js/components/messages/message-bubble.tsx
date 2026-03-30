import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useMessages } from '@/contexts/message-context';
import type { ChatMessage } from '@/contexts/message-context';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export function MessageBubble({ msg }: { msg: ChatMessage }) {
    const {
        toggleReaction,
        setReplyingTo,
        startEditingMessage,
        deleteMessage,
    } = useMessages();
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const replyTo = msg.data?.reply_to ?? null;

    const handleConfirmDelete = () => {
        deleteMessage(msg.id);
        setShowDeleteModal(false);
    };

    const handleReact = (emoji: string) => {
        toggleReaction(msg.id, emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div
            className={`group flex ${msg.is_sender ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => {
                setShowActions(false);
                setShowEmojiPicker(false);
            }}
        >
            <div className="relative max-w-[75%]">
                {/* Action bar on hover */}
                {showActions && (
                    <div
                        className={`absolute -top-8 z-10 flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-0.5 py-0.5 shadow-md ${
                            msg.is_sender ? 'right-0' : 'left-0'
                        }`}
                    >
                        {/* Emoji react */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                            className="rounded p-1 text-sm hover:bg-zinc-100"
                            title="Reageer"
                        >
                            😀
                        </button>

                        {/* Reply */}
                        <button
                            type="button"
                            onClick={() => {
                                setReplyingTo(msg);
                                setShowActions(false);
                            }}
                            className="rounded p-1 text-sm hover:bg-zinc-100"
                            title="Beantwoord"
                        >
                            ↩️
                        </button>

                        {/* Edit (only for own messages) */}
                        {msg.is_sender && (
                            <button
                                type="button"
                                onClick={() => {
                                    startEditingMessage(msg);
                                    setShowActions(false);
                                }}
                                className="rounded p-1 text-sm hover:bg-zinc-100"
                                title="Bewerk"
                            >
                                ✏️
                            </button>
                        )}

                        {/* Delete (only for own messages) */}
                        {msg.is_sender && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="rounded p-1 text-sm hover:bg-red-50"
                                title="Verwijder"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                )}

                {/* Quick emoji picker */}
                {showEmojiPicker && (
                    <div
                        className={`absolute -top-17 z-20 flex gap-1 rounded-md border border-zinc-200 bg-white px-1 py-0.5 shadow-lg ${
                            msg.is_sender ? 'right-0' : 'left-0'
                        }`}
                    >
                        {QUICK_EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleReact(emoji)}
                                className="rounded-md px-1 py-0.5 text-lg transition hover:scale-125 hover:bg-zinc-100"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reply preview */}
                {replyTo && (
                    <div
                        className={`mb-1 rounded-md border-l-3 px-3 py-1 text-xs ${
                            msg.is_sender
                                ? 'border-white/50 bg-accent/80 text-white/80'
                                : 'border-zinc-400 bg-zinc-100 text-zinc-600'
                        }`}
                    >
                        <span className="font-semibold">{replyTo.sender}</span>
                        <p className="truncate">{replyTo.body}</p>
                    </div>
                )}

                {/* Message body */}
                <div
                    className={`text-md rounded-md px-4 py-2 shadow-md ${
                        msg.is_sender
                            ? 'bg-accent text-white'
                            : 'bg-zinc-200 text-zinc-900'
                    }`}
                >
                    <p className="break-words whitespace-pre-wrap">
                        {msg.body}
                    </p>
                    <p
                        className={`mt-1 text-[11px] ${
                            msg.is_sender ? 'text-zinc-600' : 'text-zinc-500'
                        }`}
                    >
                        {new Date(msg.created_at).toLocaleTimeString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>

                {/* Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                    <div
                        className={`mt-1 flex flex-wrap gap-1 ${msg.is_sender ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.reactions.map((r) => (
                            <button
                                key={r.emoji}
                                type="button"
                                onClick={() => toggleReaction(msg.id, r.emoji)}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
                                    r.reacted_by_me
                                        ? 'border-accent bg-accent/10'
                                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                }`}
                            >
                                <span>{r.emoji}</span>
                                <span className="text-zinc-600">{r.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Bericht verwijderen</DialogTitle>
                        <DialogDescription>
                            Weet je zeker dat je dit bericht wilt verwijderen?
                            Dit kan niet ongedaan worden gemaakt.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="default"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Annuleren
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Verwijderen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
