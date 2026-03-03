import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { berichten } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import Background from '@/components/background';

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
                <div></div>
            </Background>
        </AppLayout>
    );
}
