import { Head } from '@inertiajs/react';
import BackgroundBerichten from '@/components/background-berichten';
import { ChatWindow } from '@/components/messages/chat-window';
import { UserHeaderMessage } from '@/components/messages/header-message';
import { ModalMessageActions } from '@/components/messages/modal-messageActions';
import { UserTabMessage } from '@/components/messages/tab-message';
import { MessageProvider } from '@/contexts/message-context';
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
            <MessageProvider>
                <BackgroundBerichten>
                    <UserHeaderMessage />
                    <div className="flex flex-1 overflow-hidden">
                        <UserTabMessage />
                        <ChatWindow />
                    </div>
                </BackgroundBerichten>
                <ModalMessageActions />
            </MessageProvider>
        </AppLayout>
    );
}
