import { SIDEBAR_COOKIE_NAME } from '@/constains';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import SidebarApp from '@/components/common/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import MobileBottomBar from './mobile-bottom-bar';
import { useViewState } from './states/viewState';

const RootApp = () => {
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);
  const { isMobile } = useViewState();

  if (isMobile) {
    return (
      <SidebarProvider defaultOpen={cookie === 'true'}>
        {/* Mobile Bottom Bar */}
        <MobileBottomBar />
        <div className="w-full h-full flex flex-col items-center justify-center p-0 py-4">
          <Headers />
          <Outlet />
        </div>
      </SidebarProvider>
    );
  }
  return (
    <SidebarProvider defaultOpen={cookie === 'true'}>
      {/* Desktop Sidebar Trigger */}
      <SidebarApp />
      <SidebarTrigger />
      <main className="w-full h-full flex flex-col items-center justify-center p-0 md:px-4">
        <Headers />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
export default RootApp;
