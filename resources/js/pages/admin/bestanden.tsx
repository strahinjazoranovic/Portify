import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminCardFile } from '@/components/admin/admin-card-file';
import { AdminModalFileActions } from '@/components/admin/admin-modal-fileActions';
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

type Files = {
    id: number;
    name: string;
    description: string;
    path: string;
};

export default function Bestanden() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Files | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bestanden" />
            <Background>
                <AdminCardFile
                    onOpenModal={() => {
                        setSelectedFile(null);
                        setIsModalOpen(true);
                    }}
                    onEditFile={(file) => {
                        setSelectedFile(file);
                        setIsModalOpen(true);
                    }}
                />
                <AdminModalFileActions
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    file={selectedFile}
                />
            </Background>
        </AppLayout>
    );
}
