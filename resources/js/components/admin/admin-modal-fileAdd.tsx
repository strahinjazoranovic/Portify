     import axios from 'axios';
   import { useEffect, useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { DropdownUserMenu } from '../ui/dropdown-user-menu';
    import FileUpload from '../ui/file-upload';

    type NotificationState = {
        type: 'success' | 'error';
        message: string;
    } | null;

    export function AdminModalFileAdd({
        open,
        onOpenChange,
    }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) {
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [userId, setUserId] = useState('');
        const [path, setPath] = useState<File | null>(null);
        const [submitting, setSubmitting] = useState(false);
        const [notification, setNotification] = useState<NotificationState>(null);

        // Clear notification after 6 seconds
        useEffect(() => {
            if (!notification) return;
            const timer = setTimeout(() => setNotification(null), 6000);
            return () => clearTimeout(timer);
        }, [notification]);

        // Reset form when modal closes
        useEffect(() => {
            if (!open) {
                resetForm();
            }
        }, [open]);

        const resetForm = () => {
            setName('');
            setDescription('');
            setUserId('');
            setPath(null);
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitting(true);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);

            if (userId) {
                formData.append('user_id', userId);
            }

            if (path) {
                formData.append('path', path);
            }

            try {
                await axios.post('/files', formData);

                setNotification({
                    type: 'success',
                    message: 'Bestand succesvol aangemaakt!',
                });

                setTimeout(() => {
                    onOpenChange(false);
                }, 1000);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errors = err.response?.data?.errors as
                        | Record<string, string[]>
                        | undefined;

                    const message = errors
                        ? Object.values(errors).flat().join(' ')
                        : (err.response?.data?.message ??
                        'Er is iets misgegaan. Probeer het opnieuw.');

                    setNotification({
                        type: 'error',
                        message,
                    });
                } else {
                    setNotification({
                        type: 'error',
                        message: 'Er is iets misgegaan. Probeer het opnieuw.',
                    });
                }
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="z-[1000] max-w-2xl">
                    <h1 className="text-3xl font-bold text-zinc-900">
                        Maak een nieuw bestand aan
                    </h1>

                    {notification && (
                        <div
                            className={`rounded-md border mt-2 px-4 py-3 text-sm ${
                                notification.type === 'success'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : 'border-red-200 bg-red-50 text-red-700'
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="mt-4 grid gap-2">
                            <Label htmlFor="file-name">Titel van het bestand</Label>
                            <Input
                                id="file-name"
                                type="text"
                                required
                                placeholder="Bestand"
                                className="border border-zinc-400 bg-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="file-description">Beschrijving</Label>
                            <textarea
                                id="file-description"
                                required
                                rows={3}
                                placeholder="Korte beschrijving van het bestand..."
                                className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-400 focus:outline-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <DropdownUserMenu
                                value={userId}
                                onChange={setUserId}
                                label="Voeg klanten toe aan het document"
                            />
                            <FileUpload
                                title="Upload een document"
                                buttonText="Kies bestand"
                                onFileChange={setPath}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting ? 'Bezig...' : 'Maak bestand aan'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
