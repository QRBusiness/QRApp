import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/libs/utils';
import { Button } from '../ui/button';

export interface SidebarItem {
  title: string;
  path_url: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}
export interface MobileBottomBarProps {
  items?: SidebarItem[];
}

const MobileBottomBar = ({ items }: MobileBottomBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useLocation();

  // Check if the screen width is less than 768px
  if (window.innerWidth >= 768) return null; // Hide on larger screens
  // Hide the bottom bar on larger screens
  return (
    <div
      className={`grid grid-cols-${items?.length} h-14 fixed bottom-0 left-0 right-0 w-full bg-white border-t z-50 items-center`}
    >
      {items?.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            'flex ',

            params.pathname.split('/').pop() === item.path_url && 'text-primary',
            items.length > 3 ? 'flex-col justify-center items-center' : 'flex-row items-center space-x-1'
          )}
          onClick={() => navigate(item.path_url)}
        >
          {item.icon}
          <span
            className={cn(
              'text-black font-semibold',
              params.pathname === item.path_url ? 'text-primary' : 'text-black',
              items.length > 2 ? 'text-sm' : 'text-base'
            )}
          >
            {t(item.title)}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default MobileBottomBar;
