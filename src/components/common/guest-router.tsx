import { CART, MENU_MANAGEMENT } from '@/constants';
import { Home, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import MobileBottomBar from './mobile-bottom-bar';

const GuestRouter = () => {
  const items = [
    {
      title: 'HOME',
      path_url: '/',
      icon: <Home />,
    },
    {
      title: 'Menu',
      path_url: MENU_MANAGEMENT,
      icon: <UtensilsCrossed />,
    },
    {
      title: 'Cart',
      path_url: CART,
      icon: <ShoppingCart />,
    },
  ];
  return (
    <header>
      {/* Add guest router content here */}
      <header>
        <h1 className="text-2xl font-bold">Welcome to the Guest Area</h1>
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
