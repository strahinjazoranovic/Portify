import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useMessages } from '@/contexts/message-context';

// Define user type
type User = {
    id: number;
    name: string;
    email: string;
};

export function ModalMessageActions() {
    const { showNewMessageModal, setShowNewMessageModal, startConversation } =
        useMessages();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/chat/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!showNewMessageModal) return;
        fetchUsers();
    }, [showNewMessageModal, fetchUsers]);

    // Filter users to lowercase name an demail
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <Dialog
            open={showNewMessageModal}
            onOpenChange={(open) => {
                setShowNewMessageModal(open);
                if (!open) setSearch('');
            }}
        >
            <DialogContent className="z-[1000] max-w-md">
                <DialogHeader>
                    <DialogTitle>Nieuw bericht</DialogTitle>
                </DialogHeader>

                <div className="flex items-center rounded-md border border-zinc-200 bg-[#E2E2E2] px-3 py-2">
                    <img src="/icons/searchIcon.svg" className="mr-2 h-4 w-4" />

                    <input
                        type="text"
                        placeholder="Zoek een gebruiker..."
                        className="w-full bg-transparent outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mt-2 max-h-72 overflow-y-auto">
                    {/* Show 2 loading cards */}
                    {loading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 animate-pulse rounded-md bg-gray-200"
                                />
                            ))}
                        </div>
                    ) : // If no users are found show this text
                    filteredUsers.length === 0 ? (
                        <p className="py-4 text-center text-sm text-zinc-500">
                            Geen gebruikers gevonden
                        </p>
                    ) : (
                        // For every user that is found show an button which you can click to start an conversation
                        filteredUsers.map((user) => (
                            <Button
                                key={user.id}
                                variant="ghost"
                                className="flex h-auto w-full items-center justify-start gap-3 px-3 py-4"
                                onClick={() => startConversation(user.id)}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-300 text-sm font-semibold text-zinc-700">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-zinc-900">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {user.email}
                                    </p>
                                </div>
                            </Button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
