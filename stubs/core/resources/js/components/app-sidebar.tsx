import { Link, usePage } from '@inertiajs/react';
import { BarChart2, Bell, FileText, LayoutGrid, Palette, Shield, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppLogo from '@/components/app-logo';
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
import { dashboard } from '@/routes';
import { index as adminNotifications } from '@/routes/admin/notifications';
import { index as adminUsers } from '@/routes/admin/users';
import { themeEditor } from '@/routes/dev';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslation();
    const { auth, isLocal } = usePage<{ auth: Auth; isLocal: boolean }>().props;
    const isSuperAdmin = auth.roles.includes('superadmin');

    const mainNavItems = useMemo<NavItem[]>(
        () => [
            {
                title: t('nav.dashboard'),
                href: dashboard(),
                icon: LayoutGrid,
            }
        ],
        [t],
    );

    const adminNavItems = useMemo<NavItem[]>(
        () => [
            ...(isSuperAdmin
                ? [
                      {
                          title: t('nav.admin_users'),
                          href: adminUsers(),
                          icon: Users,
                      },
                  ]
                : []),
            {
                title: t('nav.notifications'),
                href: adminNotifications(),
                icon: Bell,
            },
            {
                title: t('nav.horizon'),
                href: '/horizon',
                icon: BarChart2,
                external: true,
            },
            ...(isLocal
                ? [
                      {
                          title: t('nav.theme_editor'),
                          href: themeEditor.url(),
                          icon: Palette,
                      },
                  ]
                : []),
        ],
        [t, isSuperAdmin, isLocal],
    );

    const footerNavItems = useMemo<NavItem[]>(
        () => [
            {
                title: t('nav.terms'),
                href: '/terms',
                icon: FileText,
            },
            {
                title: t('nav.privacy_policy'),
                href: '/privacy-policy',
                icon: Shield,
            },
        ],
        [t],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isSuperAdmin && (
                    <NavMain items={adminNavItems} label={t('nav.admin')} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
