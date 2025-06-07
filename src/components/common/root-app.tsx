import { SIDEBAR_COOKIE_NAME } from '@/constains';
import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import SidebarApp from '@/components/common/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const RootApp = () => {
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);

  return (
    <SidebarProvider defaultOpen={cookie === 'true'}>
      <SidebarApp />
      <SidebarTrigger />
      <main className="w-full h-full flex flex-col items-center justify-center px-4">
        <Headers />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
export default RootApp;
