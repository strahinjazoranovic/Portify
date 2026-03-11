import { Head } from '@inertiajs/react';
import { AdminCardFile } from '@/components/admin/admin-card-file';
import Background from '@/components/background';
import AppLayout from '@/layouts/app-layout';
import { bestanden } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bestanden',
        href: bestanden().url,
    },
];

export default function Bestanden() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bestanden" />
            <Background>
                <AdminCardFile />
            </Background>
        </AppLayout>
    );
}
