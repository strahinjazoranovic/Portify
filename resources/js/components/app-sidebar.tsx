import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, berichten, bestanden, notificaties } from '@/routes';
import type { NavItem } from '@/types';
import { edit } from '@/actions/App/Http/Controllers/Settings/PasswordController';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Berichten',
        href: berichten(),
        icon: BookOpen,
    },
    {
        title: 'Bestanden',
        href: bestanden(),
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <img src="logo.png" className="h-12 w-12"></img>
                    {/* <h1 className="text-4xl font-extrabold text-zinc-900">Portify</h1> */}
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavUser />
                        <SidebarMenuButton
                            size="lg"
                            asChild
                        ></SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <Link
                    className="block w-full cursor-pointer"
                    href={notificaties()}
                    prefetch
                >
                    <div className='flex h-12 w-12z items-center gap-2 rounded-sm px-3 py-2 text-md text-zinc-600 hover:bg-zinc-200'>
                        <img src='/icons/notificationIcon.svg' className="h-6 w-6"></img>Notificaties
                    </div>
                </Link>
                <Link
                    className="block w-full cursor-pointer"
                    href={edit()}
                    prefetch
                >
                    <div className='flex h-12 w-12z items-center gap-2 rounded-sm px-3 py-2 text-md text-zinc-600 hover:bg-zinc-200'>
                        <img src='/icons/settingsIcon.svg' className="h-6 w-6"></img>Settings
                    </div>
                </Link>

                {/* <Link
                    className="block w-full cursor-pointer"
                    href={edit()}
                    prefetch
                >
                    <div className='flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100'>
                        <Notification className="mr-2" />
                        Notifications
                    </div>
                </Link> */}
            </SidebarFooter>
        </Sidebar>
    );
}
