import React from 'react';
import { ADMIN_ROLE } from '@/constains';
import { ChevronLeft, CircleHelp, LogOut, Settings, User, UserCog } from 'lucide-react';
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
import type { SidebarItem } from './mobile-bottom-bar';
import { useUserState } from './states/userState';

const systemItems = [
  {
    title: 'module.sidebar.settings',
    path_url: '#',
    icon: <Settings />,
  },
  {
    title: 'module.sidebar.help',
    path_url: '#',
    icon: <CircleHelp />,
  },
];

interface SidebarProps {
  items: SidebarItem[];
}

const SidebarApp = ({ items }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useLocation();
  const location = useLocation();
  const user = useUserState();
  const [open, setOpen] = React.useState(false);
  let accentItems: { label: string; icon: React.ReactNode; onClick: () => void }[] = [];

  if (user.role === ADMIN_ROLE && location.pathname.split('/')[1] !== 'admin') {
    accentItems.push({
      label: t('module.sidebar.admin'),
      icon: <UserCog />,
      onClick: () => {
        navigate('/admin');
      },
    });
  }

  const defaultItems = [
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

  defaultItems.map((item) => {
    accentItems.push({
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
    });
  });

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
              {items.map((item) => (
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
                    label={t('module.sidebar.greeting', { name: user.name || 'User' })}
                    items={accentItems}
                  >
                    <Button variant={'ghost'} className="w-full justify-between px-4 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <User />
                        <span>{user.name || 'User'}</span>
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
