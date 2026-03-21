import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminCardProject } from '@/components/admin/admin-card-project';
import { AdminModalProjectActions } from '@/components/admin/admin-modal-projectActions';
import Background from '@/components/background';
import { UserName } from '@/components/user/user-name';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: dashboard().url,
    },
];

// Define Project
type Project = {
    id: number;
    name: string;
    status: string;
    description: string;
    deadline: string;
    user_id?: string;
    progress: number;
    logo: string;
};

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );

    // Create a greeting based on the time of the day
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
                <AdminCardProject
                    onOpenModal={() => {
                        setSelectedProject(null);
                        setIsModalOpen(true);
                    }}
                    onEditProject={(project) => {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                    }}
                />

                <AdminModalProjectActions
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    project={selectedProject}
                />
            </Background>
        </AppLayout>
    );
}
