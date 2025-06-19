import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/libs/utils';
import { Button } from '../ui/button';

export interface SidebarItem {
  title: string;
  path_url: string;
  icon: React.ReactNode;
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
    <div className="grid grid-cols-5 h-14 fixed bottom-0 left-0 right-0 w-full bg-white border-t z-50">
      {items?.map((item) => (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            'flex flex-col items-center justify-between',
            params.pathname.includes(item.path_url) && 'text-primary'
          )}
          onClick={() => navigate(item.path_url)}
        >
          {item.icon}
          <span
            className={cn('text-xs mt-1 text-black', params.pathname === item.path_url ? 'text-primary' : 'text-black')}
          >
            {t(item.title)}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default MobileBottomBar;
