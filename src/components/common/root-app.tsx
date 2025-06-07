import { Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import Sidebar from '@/components/common/sidebar';

const RootApp = () => {
  return (
    <div>
      <Headers />
      <Sidebar />
      <main className="w-full h-full flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};
export default RootApp;
