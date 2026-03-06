import { Head } from '@inertiajs/react';
import Background from '@/components/background';
import AppLayout from '@/layouts/app-layout';
import { UserCardMessage } from '@/components/user-card-message';
import { berichten } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Berichten',
        href: berichten().url,
    },
];

export default function Berichten() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berichten" />
            <Background>
                <UserCardMessage />
            </Background>
        </AppLayout>
    );
}
