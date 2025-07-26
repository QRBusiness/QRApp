import { ACCESS_TOKEN, REFRESH_TOKEN, USER_PERMISSIONS, USER_SESSION } from '@/constants';
import { logoutService } from '@/services/auth-service';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { loadFromLocalStorage, resetTableStorage, saveToLocalStorage } from '@/libs/utils';
import type { SidebarItem } from './mobile-bottom-bar';
import { defaultUserState } from './states/userState';

interface MobileDropdownMenuProps {
  children: React.ReactNode;
  items: SidebarItem[];
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
}

const MobileDropdownMenu = ({ items, children, side, sideOffset, align, alignOffset }: MobileDropdownMenuProps) => {
  const { t } = useTranslation();
  const params = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refresh_token = loadFromLocalStorage(REFRESH_TOKEN, 'REFRESH_TOKEN');
      await logoutService({ refresh_token: refresh_token });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login');
      saveToLocalStorage(USER_SESSION, defaultUserState);
      saveToLocalStorage(USER_PERMISSIONS, []);
      saveToLocalStorage(REFRESH_TOKEN, null);
      saveToLocalStorage(ACCESS_TOKEN, null);
      resetTableStorage();
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="min-w-[180px]"
      >
        <DropdownMenuLabel>More Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          {items?.map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => navigate(item.path_url)}>
              <span className="flex items-center space-x-2">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <p
                  className={`${params.pathname.split('/').includes(item.path_url.replace(/^\//, '')) ? 'text-primary' : ''}`}
                >
                  {t(item.title)}
                </p>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem key={'logout-btn'} onClick={handleLogout}>
            <span className="flex items-center space-x-2">
              <span className="mr-2">
                <LogOut className="size-5" strokeWidth={2} />
              </span>
              {t('module.mobileSidebar.logout')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileDropdownMenu;
