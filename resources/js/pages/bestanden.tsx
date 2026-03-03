import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { bestanden } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import Background from '@/components/background';

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
                <div></div>
            </Background>
        </AppLayout>
    );
}
