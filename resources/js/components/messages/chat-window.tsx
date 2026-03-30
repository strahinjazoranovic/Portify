import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from '@/components/messages/message-bubble';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/contexts/message-context';

export function ChatWindow() {
    const {
        activeConversation,
        messages,
        messagesLoading,
        sendMessage,
        editMessage,
        replyingTo,
        setReplyingTo,
        editingMessage,
        cancelEditing,
        draftText,
        setDraftText,
    } = useMessages();
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // The textarea value: use draftText when editing, otherwise use local input
    const [inputText, setInputText] = useState('');
    const text = editingMessage ? draftText : inputText;
    const setText = editingMessage ? setDraftText : setInputText;

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus textarea when edit/reply starts
    useEffect(() => {
        if (editingMessage || replyingTo) {
            textareaRef.current?.focus();
        }
    }, [editingMessage, replyingTo]);

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setSending(true);

        if (editingMessage) {
            await editMessage(editingMessage.id, trimmed);
        } else {
            setInputText('');
            await sendMessage(trimmed, replyingTo?.id);
        }

        setSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            if (editingMessage) {
                cancelEditing();
            } else if (replyingTo) {
                setReplyingTo(null);
            }
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const cancelAction = () => {
        if (editingMessage) {
            cancelEditing();
        } else if (replyingTo) {
            setReplyingTo(null);
        }
    };

    if (!activeConversation) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-zinc-400">
                    Selecteer een gesprek of start een nieuw bericht
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
                {messagesLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-14 w-48 animate-pulse rounded-xl bg-zinc-200 ${i % 2 === 0 ? '' : 'ml-auto'}`}
                            />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-zinc-400">
                            Stuur het eerste bericht naar{' '}
                            {activeConversation.participant?.name ??
                                'deze gebruiker'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* Reply / Edit bar */}
            {(replyingTo || editingMessage) && (
                <div className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-accent">
                            {editingMessage
                                ? 'Bericht bewerken'
                                : `Beantwoord ${replyingTo?.data?.reply_to?.sender ?? ''}`}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                            {editingMessage?.body ?? replyingTo?.body}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={cancelAction}
                        className="shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-700"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Input area */}
            <div className="px-6 py-4">
                <div className="flex items-end gap-3">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder={
                            editingMessage
                                ? 'Bewerk je bericht...'
                                : 'Schrijf een bericht...'
                        }
                        className="text-md h-20 flex-1 resize-none rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 focus:border-zinc-400 focus:outline-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!text.trim() || sending}
                        className="h-20 w-20 px-6"
                    >
                        <img src="/icons/sendIcon.svg" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
