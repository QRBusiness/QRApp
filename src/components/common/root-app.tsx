import { SIDEBAR_COOKIE_NAME } from '@/constains';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import SidebarApp from '@/components/common/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import MobileBottomBar from './mobile-bottom-bar';

const RootApp = () => {
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);

  return (
    <SidebarProvider defaultOpen={cookie === 'true'}>
      <SidebarApp />
      {/* Desktop Sidebar Trigger */}
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      {/* Mobile Sidebar Trigger */}
      <div className="block md:hidden">
        <MobileBottomBar />
      </div>
      <main className="w-full h-full flex flex-col items-center justify-center p-0 md:px-4">
        <Headers />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
export default RootApp;
