import { Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import MobileBottomBar from './mobile-bottom-bar';

const GuestRouter = () => {
  return (
    <header>
      {/* Add guest router content here */}
      <Headers />
      <MobileBottomBar items={[]} />
      <main className="px-4 py-8 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </header>
  );
};

export default GuestRouter;
// This component serves as a placeholder for the guest router.
