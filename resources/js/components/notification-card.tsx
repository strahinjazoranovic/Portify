import axios from 'axios';

type Notification = {
    id: number;
    type: string;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
};

const TYPE_ICONS: Record<string, string> = {
    project_created: '📁',
    project_updated: '✏️',
    project_deleted: '🗑️',
    file_created: '📄',
    file_updated: '✏️',
    file_deleted: '🗑️',
    message_received: '💬',
};

export function NotificationCard({
    notification,
    onRead,
    onDelete,
}: {
    notification: Notification;
    onRead: (id: number) => void;
    onDelete: (id: number) => void;
}) {
    const icon = TYPE_ICONS[notification.type] ?? '🔔';

    const handleMarkAsRead = async () => {
        try {
            await axios.post(`/notifications/${notification.id}/read`);
            onRead(notification.id);
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/notifications/${notification.id}`);
            onDelete(notification.id);
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const timeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Zojuist';
        if (diffMin < 60) return `${diffMin} min geleden`;

        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `${diffHours} uur geleden`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Gisteren';

        return date.toLocaleDateString('nl-NL');
    };

    return (
        <div
            className={`flex items-start gap-4 rounded-lg border p-4 transition ${
                notification.is_read
                    ? 'border-zinc-200 bg-white'
                    : 'border-accent/30 bg-accent/5'
            }`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg">
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3
                        className={`text-sm ${notification.is_read ? 'font-medium text-zinc-700' : 'font-semibold text-zinc-900'}`}
                    >
                        {notification.title}
                    </h3>
                    <span className="shrink-0 text-xs text-zinc-400">
                        {timeAgo(notification.created_at)}
                    </span>
                </div>

                <p className="mt-0.5 text-sm text-zinc-500">
                    {notification.body}
                </p>

                {!notification.is_read ? (
                    <button
                        type="button"
                        onClick={handleMarkAsRead}
                        className="mt-2 text-xs font-medium text-accent hover:cursor-pointer hover:underline"
                    >
                        Markeer als gelezen
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="mt-2 text-xs font-medium text-red-500 hover:cursor-pointer hover:underline"
                    >
                        Verwijderen
                    </button>
                )}
            </div>

            {!notification.is_read && (
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            )}
        </div>
    );
}
