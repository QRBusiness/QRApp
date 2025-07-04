import { useMemo } from 'react';
import {
  ADMIN_ROLE,
  BRANCH,
  BUSINESS,
  BUSINESS_OWNER_MANAGEMENT,
  BUSINESS_TYPE,
  CATEGORY_MANAGEMENT,
  LOGIN,
  SIDEBAR_COOKIE_NAME,
  STAFF_MANAGEMENT,
  SUBCATEGORY_MANAGEMENT,
} from '@/constants';
import { DASHBOARD, MENU_MANAGEMENT, ORDER_MANAGEMENT, PROFILE, QR_MANAGEMENT } from '@/constants';
import Cookies from 'js-cookie';
import {
  Building2,
  ChartColumnStacked,
  ChartNoAxesCombined,
  Contact,
  HandPlatter,
  QrCode,
  User,
  UserCog,
  UtensilsCrossed,
} from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Headers from '@/components/common/headers';
import MobileBottomBar, { type SidebarItem } from '@/components/common/mobile-bottom-bar';
import SidebarApp from '@/components/common/sidebar';
import { useUserState } from '@/components/common/states/userState';
import { useViewState } from '@/components/common/states/viewState';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface RootAppProps {
  role: string[];
}

const RootApp = ({ role }: RootAppProps) => {
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);
  const location = useLocation();
  const { isMobile } = useViewState();
  const { role: currentRole } = useUserState();
  if (!role.includes(currentRole)) {
    return <Navigate to={LOGIN} replace={true} />;
  }

  const mobileSidebarItems: SidebarItem[] = useMemo(
    () => [
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
    ],
    []
  );
  const sidebarItems: SidebarItem[] = useMemo(() => {
    if (role.includes(ADMIN_ROLE)) {
      return [
        {
          title: 'module.sidebar.business-type',
          path_url: BUSINESS_TYPE,
          icon: <Building2 />,
        },
        {
          title: 'module.sidebar.business',
          path_url: BUSINESS,
          icon: <Building2 />,
        },
        {
          title: 'module.sidebar.business-owner-management',
          path_url: BUSINESS_OWNER_MANAGEMENT,
          icon: <Contact />,
        },
      ];
    }
    return [
      {
        title: 'module.sidebar.dashboard',
        path_url: DASHBOARD,
        icon: <ChartNoAxesCombined />,
      },
      {
        title: 'module.sidebar.qr-management',
        path_url: QR_MANAGEMENT,
        icon: <QrCode />,
      },
      {
        title: 'module.sidebar.menu-management',
        path_url: MENU_MANAGEMENT,
        icon: <UtensilsCrossed />,
        children: [
          {
            title: 'module.sidebar.menu-management.categories',
            path_url: CATEGORY_MANAGEMENT,
            icon: <ChartColumnStacked />,
          },
          {
            title: 'module.sidebar.menu-management.subcategories',
            path_url: SUBCATEGORY_MANAGEMENT,
            icon: <ChartColumnStacked />,
          },
        ],
      },
      {
        title: 'module.sidebar.order-management',
        path_url: ORDER_MANAGEMENT,
        icon: <HandPlatter />,
      },
      {
        title: 'module.sidebar.staff-management',
        path_url: STAFF_MANAGEMENT,
        icon: <UserCog />,
      },
      {
        title: 'module.sidebar.branch',
        path_url: BRANCH,
        icon: <Building2 />,
      },
    ];
  }, [location.pathname, role]);

  if (isMobile) {
    return (
      <SidebarProvider defaultOpen={cookie === 'true'}>
        {/* Mobile Bottom Bar */}
        <MobileBottomBar items={mobileSidebarItems} />
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
      <SidebarApp items={sidebarItems} />
      <SidebarTrigger />
      <main className="w-full h-full flex flex-col items-center justify-center p-0 md:px-4">
        <Headers />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
export default RootApp;
