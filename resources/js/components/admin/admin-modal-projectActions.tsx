import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownUserMenu } from '../ui/dropdown-user-menu';
import FileUpload from '../ui/file-upload';

// Define options for status which user can select when editing or creating
const STATUS_OPTIONS = [
    'Not started',
    'In development',
    'In testing',
    'Finished',
] as const;

// Define notification types
type NotificationState = { type: 'success' | 'error'; message: string } | null;

// Define projecet
type Project = {
    id: number;
    name: string;
    description: string;
    deadline: string;
    status: string;
    user_id?: string;
    logo: string;
    progress: number;
};

export function AdminModalProjectActions({
    open,
    onOpenChange,
    project,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: Project | null;
}) {
    // Determines if the user is in edit mode
    const isEditing = !!project;

    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<string>('Not started');
    const [userId, setUserId] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [notification, setNotification] = useState<NotificationState>(null);

    // If the user is editing, prefill the input fields
    useEffect(() => {
        if (open && project) {
            setName(project.name);
            setDescription(project.description);
            setDeadline(project.deadline);
            setStatus(project.status);
            setUserId(project.user_id ?? '');
            setProgress(project.progress ?? 0);
        }
    }, [project, open]);

    // Clear notification after 4 seconds
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => setNotification(null), 4000);
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
        setDeadline('');
        setDescription('');
        setStatus('Not started');
        setUserId('');
        setLogo(null);
        setProgress(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('deadline', deadline);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('progress', String(progress));

        if (userId) formData.append('user_id', userId);
        if (logo) formData.append('logo', logo);

        try {
            if (isEditing && project) {
                await axios.post(
                    `/projects/${project.id}?_method=PUT`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    },
                );

                setNotification({
                    type: 'success',
                    message: 'Project succesvol aangepast!',
                });
            } else {
                await axios.post('/projects', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setNotification({
                    type: 'success',
                    message: 'Project succesvol aangemaakt!',
                });
            }

            resetForm();

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
                    {isEditing
                        ? 'Bewerk project'
                        : 'Maak een nieuw project aan'}
                </h1>

                {notification && (
                    <div
                        className={`mt-2 rounded-md border px-4 py-3 text-sm ${
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

                    {/* Only show this code when editing */}
                    {isEditing && (
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="proj-progress">
                                    Voortgang ({progress}%)
                                </Label>
                            </div>

                            <input
                                id="proj-progress"
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) =>
                                    setProgress(Number(e.target.value))
                                }
                                style={{
                                    background: `linear-gradient(to right, #99C2A2 ${progress}%, white ${progress}%)`,
                                }}
                                className="h-4 w-full appearance-none rounded-md border border-zinc-400 bg-white py-4 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-zinc-900"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Bezig...'
                            : isEditing
                              ? 'Sla wijzigingen op'
                              : 'Maak project aan'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
