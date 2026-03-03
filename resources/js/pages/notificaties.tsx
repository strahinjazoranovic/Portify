import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { notificaties } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import Background from '@/components/background';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificaties',
        href: notificaties().url,
    },
];

export default function Notificaties() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificaties" />
            <Background>
                <div></div>
            </Background>
        </AppLayout>
    );
}
