import React from 'react';
import { DASHBOARD, MENU_MANAGEMENT, ORDER_MANAGEMENT, QR_MANAGEMENT, STAFF_MANAGEMENT } from '@/constains';
import {
  ChartNoAxesCombined,
  ChevronLeft,
  CircleHelp,
  HandPlatter,
  LogOut,
  QrCode,
  Settings,
  User,
  UserCog,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/libs/utils';
import { Button } from '../ui/button';
import { CustomDropdownMenu } from './custom-dropdown-menu';

const sidebarItems = [
  {
    title: 'module.sidebar.dashboard',
    path_url: DASHBOARD,
    icon: <ChartNoAxesCombined />,
  },
  {
    title: 'module.sidebar.qr-management',
    path_url: QR_MANAGEMENT,
    icon: <QrCode />,
  },
  {
    title: 'module.sidebar.menu-management',
    path_url: MENU_MANAGEMENT,
    icon: <UtensilsCrossed />,
  },
  {
    title: 'module.sidebar.order-management',
    path_url: ORDER_MANAGEMENT,
    icon: <HandPlatter />,
  },
  {
    title: 'module.sidebar.staff-management',
    path_url: STAFF_MANAGEMENT,
    icon: <UserCog />,
  },
];

const systemItems = [
  {
    title: 'module.sidebar.settings',
    path_url: '/',
    icon: <Settings />,
  },
  {
    title: 'module.sidebar.help',
    path_url: '/',
    icon: <CircleHelp />,
  },
];

const SidebarApp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const params = useLocation();

  const username = 'Username'; // Replace with actual username logic if needed

  const accentItems = [
    {
      label: t('module.sidebar.account'),
      icon: <User />,
      onClick: () => {},
    },
    {
      label: t('module.sidebar.logout'),
      icon: <LogOut />,
      onClick: () => {},
    },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <p className="text-center flex items-center justify-center bg-red-300">{t('module.app.name')}</p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="w-full space-y-2">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={'ghost'}
                      className={cn(
                        'w-full justify-start px-4 cursor-pointer',
                        params.pathname.includes(item.path_url) ? 'text-primary' : ''
                      )}
                      onClick={() => navigate(item.path_url)}
                    >
                      {item.icon}
                      <span>{t(item.title)}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="w-full space-y-2">
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={'ghost'}
                      className="w-full justify-start px-4 cursor-pointer"
                      onClick={() => navigate(item.path_url)}
                    >
                      {item.icon}
                      <span>{t(item.title)}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <CustomDropdownMenu
                    open={open}
                    onOpenChange={() => setOpen(!open)}
                    label={t('module.sidebar.greeting', { name: username })}
                    items={accentItems}
                  >
                    <Button variant={'ghost'} className="w-full justify-between px-4 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <User />
                        <span>{username}</span>
                      </div>
                      <ChevronLeft className={cn('transition-all duration-300 ease-in-out', open ? 'rotate-90' : '')} />
                    </Button>
                  </CustomDropdownMenu>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarApp;
