import UserTabCardMessage from '@/components/messages/tabCard-message';

export function UserTabMessage() {
    return (
        <div className="flex h-full w-75 flex-col overflow-y-auto border-r border-zinc-200 bg-white pt-4 shadow-md">
            <h2 className="mb-3 px-6 text-lg font-semibold text-zinc-900">
                Gesprekken
            </h2>
            <UserTabCardMessage />
        </div>
    );
}
