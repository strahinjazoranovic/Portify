import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownUserMenu } from '../ui/dropdown-user-menu';
import FileUpload from '../ui/file-upload';

// Status options that an option can choose
const STATUS_OPTIONS = [
    'Not started',
    'In development',
    'In testing',
    'Finished',
] as const;

// Type for notifications
type NotificationState = { type: 'success' | 'error'; message: string } | null;

export function AdminModalProjectAdd({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<string>('Not started');
    const [userId, setUserId] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState<NotificationState>(null);

    // Clear notification after 6 seconds
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => setNotification(null), 6000);
        return () => clearTimeout(timer);
    }, [notification]);

    const resetForm = () => {
        setName('');
        setDeadline('');
        setDescription('');
        setStatus('Not started');
        setUserId('');
        setLogo(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('deadline', deadline);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('progress', '0');
        if (userId) formData.append('user_id', userId);
        if (logo) formData.append('logo', logo);

        try {
            await axios.post('/projects', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setNotification({
                type: 'success',
                message: 'Project succesvol aangemaakt!',
            });
            resetForm();

            // When a project gets made reload the page after 1 second
            setTimeout(() => {
                onOpenChange(false);
                window.location.reload();
            }, 1000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errors = err.response?.data?.errors;
                const message = errors
                    ? Object.values(errors).flat().join(' ')
                    : (err.response?.data?.message ??
                      'Er is iets misgegaan. Probeer het opnieuw.');
                setNotification({ type: 'error', message: message as string });
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
                    Maak een nieuw project aan
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
                        <Label htmlFor="proj-name">Titel van het project</Label>
                        <Input
                            id="proj-name"
                            type="text"
                            required
                            autoFocus
                            placeholder="Portify"
                            className="border border-zinc-400 bg-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="proj-description">Beschrijving</Label>
                        <textarea
                            id="proj-description"
                            required
                            rows={3}
                            placeholder="Korte beschrijving van het project..."
                            className="w-full rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-400 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="proj-deadline">Deadline</Label>
                            <Input
                                id="proj-deadline"
                                type="date"
                                required
                                className="border border-zinc-400 bg-white"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="proj-status">Status</Label>
                            <select
                                id="proj-status"
                                required
                                className="h-10 w-full rounded-md border border-zinc-400 bg-white px-3 text-sm focus:ring-2 focus:ring-zinc-400 focus:outline-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <DropdownUserMenu value={userId} onChange={setUserId} />
                        <FileUpload onFileChange={setLogo} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                    >
                        {submitting ? 'Bezig...' : 'Maak project aan'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
