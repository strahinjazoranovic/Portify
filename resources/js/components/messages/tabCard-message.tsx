import { useMessages } from '@/contexts/message-context';

export default function UserTabCardMessage() {
    const { conversations, activeConversation, selectConversation, loading } =
        useMessages();

    // Show 4 cards when the conversations are loading from the database
    if (loading) {
        return (
            <div className="space-y-3 px-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-18 animate-pulse rounded-xl bg-zinc-200"
                    />
                ))}
            </div>
        );
    }

    // If there are no conversations found show this text
    if (conversations.length === 0) {
        return (
            <div className="px-4 text-sm text-zinc-500">
                Nog geen gesprekken gestart.
            </div>
        );
    }

    return (
        <div className="space-y-2 px-6">
            {conversations.map((conversation) => {
                // Check if this conversation is currently active
                const isActive = activeConversation?.id === conversation.id;

                return (
                    <button
                        key={conversation.id} // Unique key for React list rendering
                        type="button"
                        onClick={() => selectConversation(conversation)} // Handle conversation selection
                        className={`w-full rounded-xl border border-zinc-300 px-4 py-3 text-left transition ${
                            isActive
                                ? 'bg-zinc-100'
                                : 'bg-white hover:cursor-pointer hover:bg-zinc-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-300 text-sm font-semibold text-zinc-700">
                                {conversation.participant?.name
                                    ?.charAt(0)
                                    .toUpperCase() ?? '?'}{' '}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-zinc-900">
                                    {conversation.participant?.name ??
                                        'Onbekende gebruiker'}{' '}
                                </p>

                                <div className="flex justify-between">
                                    <p className="truncate text-sm text-zinc-500">
                                        {conversation.last_message?.body ??
                                            'Nog geen berichten'}{' '}
                                    </p>

                                    {/* Show time in a formatted way */}
                                    <p className="truncate text-sm text-zinc-500">
                                        {conversation.last_message?.created_at
                                            ? new Date(
                                                  conversation.last_message
                                                      .created_at,
                                              ).toLocaleTimeString('nl-NL', {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
