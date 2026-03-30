import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Participant = {
    id: number;
    name: string;
    avatar?: string | null;
};

export type ConversationItem = {
    id: number;
    participant: Participant | null;
    last_message: {
        body: string;
        created_at: string;
    } | null;
    updated_at: string;
};

export type ReactionItem = {
    emoji: string;
    count: number;
    reacted_by_me: boolean;
};

export type ReplyTo = {
    id: number;
    body: string;
    sender: string;
};

export type ChatMessage = {
    id: number;
    body: string;
    conversation_id: number;
    is_sender: boolean;
    data?: { reply_to?: ReplyTo } | null;
    reactions: ReactionItem[];
    created_at: string;
};

type MessageContextType = {
    conversations: ConversationItem[];
    activeConversation: ConversationItem | null;
    messages: ChatMessage[];
    loading: boolean;
    messagesLoading: boolean;
    showNewMessageModal: boolean;
    replyingTo: ChatMessage | null;
    editingMessage: ChatMessage | null;
    draftText: string;
    setDraftText: (text: string) => void;
    setShowNewMessageModal: (show: boolean) => void;
    selectConversation: (conversation: ConversationItem) => void;
    startConversation: (userId: number) => Promise<void>;
    sendMessage: (text: string, replyToId?: number) => Promise<void>;
    editMessage: (messageId: number, newBody: string) => Promise<void>;
    deleteMessage: (messageId: number) => Promise<void>;
    toggleReaction: (messageId: number, emoji: string) => Promise<void>;
    setReplyingTo: (message: ChatMessage | null) => void;
    startEditingMessage: (message: ChatMessage) => void;
    cancelEditing: () => void;
    refreshConversations: () => Promise<void>;
};

const MessageContext = createContext<MessageContextType | null>(null);

export function useMessages() {
    const ctx = useContext(MessageContext);
    if (!ctx) throw new Error('useMessages must be used within MessageProvider');
    return ctx;
}

export function MessageProvider({ children }: { children: ReactNode }) {
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
    const [draftText, setDraftText] = useState('');

    const startEditingMessage = useCallback((message: ChatMessage) => {
        setEditingMessage(message);
        setDraftText(message.body);
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingMessage(null);
        setDraftText('');
    }, []);

    // Fetch conversations on mount
    const refreshConversations = useCallback(async () => {
        try {
            const res = await axios.get('/chat/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    // Fetch messages when active conversation changes
    const fetchMessages = useCallback(async (conversationId: number) => {
        setMessagesLoading(true);
        try {
            const res = await axios.get(`/chat/messages/${conversationId}`);
            // The musonza paginator returns { data: [...] }
            const data = res.data?.data ?? res.data;
            setMessages(Array.isArray(data) ? data : []);

            // Mark as read
            await axios.post(`/chat/read/${conversationId}`);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    }, []);

    const selectConversation = useCallback(
        (conversation: ConversationItem) => {
            setActiveConversation(conversation);
            fetchMessages(conversation.id);
        },
        [fetchMessages],
    );

    const startConversation = useCallback(
        async (userId: number) => {
            try {
                const res = await axios.post('/chat/start', { user_id: userId });
                const conv: ConversationItem = res.data;

                // Add to list if not already present
                setConversations((prev) => {
                    const exists = prev.find((c) => c.id === conv.id);
                    return exists ? prev : [conv, ...prev];
                });

                // Select the conversation
                setActiveConversation(conv);
                fetchMessages(conv.id);
                setShowNewMessageModal(false);
            } catch (err) {
                console.error('Failed to start conversation:', err);
            }
        },
        [fetchMessages],
    );

    const sendMessage = useCallback(
        async (text: string, replyToId?: number) => {
            if (!activeConversation) return;

            try {
                const res = await axios.post('/chat/send', {
                    message: text,
                    conversation_id: activeConversation.id,
                    reply_to_id: replyToId ?? null,
                });

                const newMsg: ChatMessage = res.data;
                setMessages((prev) => [...prev, newMsg]);
                setReplyingTo(null);

                // Update last_message in the conversation list
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeConversation.id
                            ? { ...c, last_message: { body: text, created_at: newMsg.created_at }, updated_at: newMsg.created_at }
                            : c,
                    ),
                );
                setActiveConversation((prev) =>
                    prev ? { ...prev, last_message: { body: text, created_at: newMsg.created_at }, updated_at: newMsg.created_at } : prev,
                );
            } catch (err) {
                console.error('Failed to send message:', err);
            }
        },
        [activeConversation],
    );

    const editMessage = useCallback(async (messageId: number, newBody: string) => {
        try {
            const res = await axios.put(`/chat/messages/${messageId}`, { message: newBody });
            setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, body: res.data.body } : m)),
            );
            setEditingMessage(null);
            setDraftText('');
        } catch (err) {
            console.error('Failed to edit message:', err);
        }
    }, []);

    const deleteMessage = useCallback(async (messageId: number) => {
        try {
            await axios.delete(`/chat/messages/${messageId}`);
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    }, []);

    const toggleReaction = useCallback(async (messageId: number, emoji: string) => {
        try {
            const res = await axios.post(`/chat/messages/${messageId}/react`, { reaction: emoji });
            const updatedReactions: ReactionItem[] = res.data.reactions;
            setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, reactions: updatedReactions } : m)),
            );
        } catch (err) {
            console.error('Failed to toggle reaction:', err);
        }
    }, []);

    return (
        <MessageContext.Provider
            value={{
                conversations,
                activeConversation,
                messages,
                loading,
                messagesLoading,
                showNewMessageModal,
                replyingTo,
                editingMessage,
                draftText,
                setDraftText,
                setShowNewMessageModal,
                selectConversation,
                startConversation,
                sendMessage,
                editMessage,
                deleteMessage,
                toggleReaction,
                setReplyingTo,
                startEditingMessage,
                cancelEditing,
                refreshConversations,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}
