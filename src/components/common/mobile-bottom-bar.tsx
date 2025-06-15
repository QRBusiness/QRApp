import { DASHBOARD, MENU_MANAGEMENT, ORDER_MANAGEMENT, PROFILE, QR_MANAGEMENT } from '@/constains';
import { ChartNoAxesCombined, HandPlatter, QrCode, User, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/libs/utils';
import { Button } from '../ui/button';

const sidebarItems = [
  {
    title: 'module.mobileSidebar.dashboard',
    path_url: DASHBOARD,
    icon: <ChartNoAxesCombined />,
  },
  {
    title: 'module.mobileSidebar.qr-management',
    path_url: QR_MANAGEMENT,
    icon: <QrCode />,
  },
  {
    title: 'module.mobileSidebar.menu-management',
    path_url: MENU_MANAGEMENT,
    icon: <UtensilsCrossed />,
  },
  {
    title: 'module.mobileSidebar.order-management',
    path_url: ORDER_MANAGEMENT,
    icon: <HandPlatter />,
  },
  {
    title: 'module.mobileSidebar.profile',
    path_url: PROFILE,
    icon: <User />,
  },
];
const MobileBottomBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useLocation();

  // Check if the screen width is less than 768px
  if (window.innerWidth >= 768) return null; // Hide on larger screens
  // Hide the bottom bar on larger screens
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t z-50">
      <div className="grid grid-cols-5 h-14">
        {sidebarItems.map((item) => (
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
              className={cn(
                'text-xs mt-1 text-black',
                params.pathname === item.path_url ? 'text-primary' : 'text-black'
              )}
            >
              {t(item.title)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomBar;
