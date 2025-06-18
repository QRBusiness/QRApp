import { LOGIN, SIDEBAR_COOKIE_NAME } from '@/constains';
import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';
import Headers from '@/components/common/headers';
import SidebarApp from '@/components/common/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import MobileBottomBar from './mobile-bottom-bar';
import { useUserState } from './states/userState';
import { useViewState } from './states/viewState';

interface RootAppProps {
  role: string;
}

const RootApp = ({ role }: RootAppProps) => {
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);
  const { isMobile } = useViewState();
  const { role: currentRole } = useUserState();
  if (role !== currentRole && currentRole !== 'BusinessOwner') {
    return <Navigate to={LOGIN} replace={true} />;
  }

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
