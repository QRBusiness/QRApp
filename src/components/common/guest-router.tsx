import { CART, MENU_MANAGEMENT, ORDER_MANAGEMENT } from '@/constants';
import { HandPlatter, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MobileBottomBar from './mobile-bottom-bar';
import { ToggleChangeLanguage } from './toggle-change-language';

const GuestRouter = () => {
  const { t } = useTranslation();
  const items = [
    {
      title: t('module.mobileSidebar.menu-management'),
      path_url: MENU_MANAGEMENT,
      icon: <UtensilsCrossed />,
    },
    {
      title: t('module.mobileSidebar.cart'),
      path_url: CART,
      icon: <ShoppingCart />,
    },
    {
      title: t('module.mobileSidebar.order'),
      path_url: ORDER_MANAGEMENT,
      icon: <HandPlatter />,
    },
  ];
  return (
    <header>
      {/* Add guest router content here */}
      <header className="flex justify-between items-center bg-muted p-2 shadow-md">
        <div className="w-15"></div>
        <h1 className="text-2xl font-bold text-center">{t('module.app.name')}</h1>
        <ToggleChangeLanguage />
      </header>
      <MobileBottomBar items={items} />
      <main className="px-4 py-8 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </header>
  );
};

export default GuestRouter;
// This component serves as a placeholder for the guest router.
