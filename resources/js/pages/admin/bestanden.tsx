import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminCardFile } from '@/components/admin/admin-card-file';
import { AdminModalFileAdd } from '@/components/admin/admin-modal-fileAdd';
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bestanden" />
            <Background>
                <AdminCardFile onOpenModal={() => setIsModalOpen(true)} />
                <AdminModalFileAdd
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            </Background>
        </AppLayout>
    );
}
