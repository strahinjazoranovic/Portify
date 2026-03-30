import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import Background from '@/components/background';
import { NotificationCard } from '@/components/notification-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { notificaties } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificaties',
        href: notificaties().url,
    },
];

type Notification = {
    id: number;
    type: string;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
};

export default function Notificaties() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
    };

    const handleDelete = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificaties" />
            <Background>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-900">
                        Notificaties
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs text-white">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    {unreadCount > 0 && (
                        <Button variant="default" onClick={handleMarkAllAsRead}>
                            Alles als gelezen markeren
                        </Button>
                    )}
                </div>

                <div className="mt-4 space-y-3">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-20 animate-pulse rounded-lg bg-white shadow-md" />
                        ))
                    ) : notifications.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow-md">
                            <p className="text-zinc-500">Geen notificaties</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <NotificationCard key={n.id} notification={n} onRead={handleRead} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            </Background>
        </AppLayout>
    );
}
