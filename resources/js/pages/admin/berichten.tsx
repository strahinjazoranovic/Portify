import { Head } from '@inertiajs/react';
import BackgroundBerichten from '@/components/background-berichten';
// import { UserCardMessage } from '@/components/user-card-message';
import { UserHeaderMessage } from '@/components/user/user-header-message';
import { UserTabMessage } from '@/components/user/user-tab-message';
import AppLayout from '@/layouts/app-layout';
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
            <BackgroundBerichten>
                <UserHeaderMessage />
                <UserTabMessage />
                {/* <UserCardMessage /> */}
            </BackgroundBerichten>
        </AppLayout>
    );
}
