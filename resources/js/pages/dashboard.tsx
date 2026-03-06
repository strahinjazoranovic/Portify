import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Background from '@/components/background';
import { UserCardDeadline } from '@/components/user-card-deadline';
import { UserCardProject } from '@/components/user-card-project';
import { UserName } from '@/components/user-name';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 6 && hour < 12) return 'Goeiemorgen';
        if (hour >= 12 && hour < 18) return 'Goedemiddag';
        return 'Goedeavond';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Background>
                <h1 className="text-4xl font-medium text-zinc-600">
                    {getGreeting()} <UserName user={auth.user} />
                </h1>
                <UserCardDeadline/>
                <UserCardProject />
            </Background>
        </AppLayout>
    );
}
    