import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ user }: { user?: { name: string } }) {
    useEffect(() => {
        console.log('User object:', user);
        console.log('User name:', user?.name);
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 6 && hour < 12) return 'Goeiemorgen';
        if (hour >= 12 && hour < 18) return 'Goedemiddag';
        return 'Goedeavond';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold text-zinc-600">
                    {getGreeting()} {user?.name || 'Gebruiker'}
                </h1>
            </div>
        </AppLayout>
    );
}
