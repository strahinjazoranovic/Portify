import { Button } from '@/components/ui/button';
import { useMessages } from '@/contexts/message-context';

export function UserHeaderMessage() {
    const { activeConversation, setShowNewMessageModal } = useMessages();

    return (
        <div className="flex h-20 w-full items-center justify-between border-b border-zinc-200 bg-white px-6 shadow-md">
            <div className="flex items-center gap-3">
                {activeConversation ? (
                    <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-300 text-sm font-semibold text-zinc-700">
                            {activeConversation.participant?.name
                                ?.charAt(0)
                                .toUpperCase() ?? '?'}
                        </div>
                        {/* Show username from current conversations */}
                        <h1 className="text-lg font-semibold text-zinc-900">
                            {activeConversation.participant?.name ??
                                'Onbekende gebruiker'}
                        </h1>
                    </>
                ) : (
                    <h1 className="text-lg font-medium text-zinc-400">
                        Berichten
                    </h1>
                )}
            </div>

            {/* Open an modal when you click on Nieuw bericht*/}
            <Button
                className="text-md w-60"
                onClick={() => setShowNewMessageModal(true)}
            >
                Nieuw bericht
            </Button>
        </div>
    );
}
