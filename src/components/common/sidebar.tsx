import React from 'react';
import { ACCESS_TOKEN, ADMIN_ROLE, PROFILE, REFRESH_TOKEN, USER_PERMISSIONS, USER_SESSION } from '@/constants';
import { logoutService } from '@/services/auth-service';
import { ChevronLeft, ChevronRight, CircleHelp, LogOut, Settings, User, UserCog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn, loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';
import { CustomDropdownMenu } from './custom-dropdown-menu';
import type { SidebarItem } from './mobile-bottom-bar';
import { defaultUserState, useUserState } from './states/userState';

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

  const handleLogout = async () => {
    const refresh_token = loadFromLocalStorage(REFRESH_TOKEN, 'REFRESH_TOKEN');
    await logoutService({ refresh_token: refresh_token });
    navigate('/login');
    saveToLocalStorage(USER_SESSION, defaultUserState);
    saveToLocalStorage(USER_PERMISSIONS, []);
    saveToLocalStorage(REFRESH_TOKEN, null);
    saveToLocalStorage(ACCESS_TOKEN, null);
  };

  const defaultItems = [
    {
      label: t('module.sidebar.account'),
      icon: <User />,
      onClick: () => navigate(`${PROFILE}`),
    },
    {
      label: t('module.sidebar.logout'),
      icon: <LogOut />,
      onClick: async () => await handleLogout(),
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
                <Collapsible key={item.title} asChild defaultOpen={false} className="group/collapsible">
                  <SidebarMenuItem key={item.title}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={'ghost'}
                          className={cn(
                            'w-full justify-start px-4 cursor-pointer',
                            params.pathname.split('/').includes(item.path_url.replace(/^\//, '')) ? 'text-primary' : ''
                          )}
                          onClick={() => navigate(item.path_url)}
                        >
                          {item.icon}
                          <span>{t(item.title)}</span>
                          {item.children && item.children.length > 0 && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </Button>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.children && item.children.length > 0 && (
                        <SidebarMenuSub>
                          {item.children.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  'w-full justify-start px-4 cursor-pointer',
                                  params.pathname.split('/').includes(subItem.path_url.replace(/^\//, ''))
                                    ? 'text-primary'
                                    : ''
                                )}
                                onClick={() => navigate(item.path_url + '/' + subItem.path_url)}
                              >
                                <Button variant={'ghost'}>
                                  {subItem.icon}
                                  <span>{t(subItem.title)}</span>
                                </Button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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
