import { useMemo } from 'react';
import {
  ADMIN_ROLE,
  BRANCH,
  BUSINESS,
  BUSINESS_OWNER_MANAGEMENT,
  BUSINESS_TYPE,
  CATEGORY_MANAGEMENT,
  LOGIN,
  PLAN,
  REQUEST,
  SIDEBAR_COOKIE_NAME,
  STAFF_MANAGEMENT,
  SUBCATEGORY_MANAGEMENT,
} from '@/constants';
import { DASHBOARD, MENU_MANAGEMENT, ORDER_MANAGEMENT, PROFILE, QR_MANAGEMENT } from '@/constants';
import Cookies from 'js-cookie';
import {
  Bell,
  Building2,
  CalendarPlus,
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
import { useUserPermissions, useUserState } from '@/components/common/states/userState';
import { useViewState } from '@/components/common/states/viewState';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import webSocketService from '@/config/socket';
import { havePermissions } from '@/libs/utils';

interface RootAppProps {
  role: string[];
}

const webSocketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000/ws';

const RootApp = ({ role }: RootAppProps) => {
  webSocketService.connect(webSocketUrl);
  const cookie = Cookies.get(SIDEBAR_COOKIE_NAME);
  const location = useLocation();
  const { isMobile } = useViewState();
  const { role: currentRole } = useUserState();
  const { permissions } = useUserPermissions();
  const permissionsList = permissions.map((permission) => permission.code);

  if (!role.includes(currentRole)) {
    return <Navigate to={LOGIN} replace={true} />;
  }

  const mobileSidebarItems: SidebarItem[] = useMemo(() => {
    if (role.includes(ADMIN_ROLE)) {
      return [
        {
          title: 'module.mobileSidebar.business-type',
          path_url: BUSINESS_TYPE,
          icon: <Building2 strokeWidth={2} className="size-5" />,
        },
        {
          title: 'module.mobileSidebar.business',
          path_url: BUSINESS,
          icon: <Building2 strokeWidth={2} className="size-5" />,
        },
        {
          title: 'module.mobileSidebar.business-owner-management',
          path_url: BUSINESS_OWNER_MANAGEMENT,
          icon: <Contact strokeWidth={2} className="size-5" />,
        },
        {
          title: 'module.mobileSidebar.plan',
          path_url: PLAN,
          icon: <CalendarPlus strokeWidth={2} className="size-5" />,
        },
        {
          title: 'module.mobileSidebar.profile',
          path_url: PROFILE,
          icon: <User strokeWidth={2} className="size-5" />,
        },
      ];
    } else {
      const permissionMap: Array<{
        codes: string[];
        item: SidebarItem | (() => SidebarItem);
        withoutPermission?: boolean;
      }> = [
        {
          codes: ['view.serviceunit'],
          item: {
            title: 'module.mobileSidebar.qr-management',
            path_url: QR_MANAGEMENT,
            icon: <QrCode strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.product'],
          item: {
            title: 'module.mobileSidebar.menu-management',
            path_url: MENU_MANAGEMENT,
            icon: <UtensilsCrossed strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.order'],
          item: {
            title: 'module.mobileSidebar.order-management',
            path_url: ORDER_MANAGEMENT,
            icon: <HandPlatter strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.request'],
          item: {
            title: 'module.mobileSidebar.request',
            path_url: REQUEST,
            icon: <Bell strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.dashboard'],
          withoutPermission: true, // Allow access without specific permission
          item: {
            title: 'module.mobileSidebar.dashboard',
            path_url: DASHBOARD,
            icon: <ChartNoAxesCombined strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.branch', 'view.area'],
          item: {
            title: 'module.mobileSidebar.branch',
            path_url: BRANCH,
            icon: <Building2 strokeWidth={2} className="size-5" />,
          },
        },
        {
          codes: ['view.user', 'view.group'],
          item: {
            title: 'module.mobileSidebar.staff-management',
            path_url: STAFF_MANAGEMENT,
            icon: <UserCog strokeWidth={2} className="size-5" />,
          },
        },
      ];
      const mobileItems: SidebarItem[] = [];
      permissionMap.forEach(({ codes, item, withoutPermission }) => {
        if (havePermissions(permissionsList, codes) || withoutPermission) {
          mobileItems.push(typeof item === 'function' ? item() : item);
        }
      });
      mobileItems.push({
        title: 'module.mobileSidebar.profile',
        path_url: PROFILE,
        icon: <User />,
      });
      return mobileItems;
    }
  }, [role, currentRole]);

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
        {
          title: 'module.sidebar.plan',
          path_url: PLAN,
          icon: <CalendarPlus />,
        },
      ];
    } else {
      const businessOptions: SidebarItem[] = [];
      const permissionMap: Array<{
        codes: string[];
        item: SidebarItem | (() => SidebarItem);
        withoutPermission?: boolean;
      }> = [
        {
          codes: ['view.dashboard'],
          withoutPermission: true, // Allow access without specific permission
          item: {
            title: 'module.sidebar.dashboard',
            path_url: DASHBOARD,
            icon: <ChartNoAxesCombined />,
          },
        },
        {
          codes: ['view.serviceunit'],
          item: {
            title: 'module.sidebar.qr-management',
            path_url: QR_MANAGEMENT,
            icon: <QrCode />,
          },
        },
        {
          codes: ['view.product'],
          item: () => {
            const children: SidebarItem[] = [];
            if (havePermissions(permissionsList, ['view.category'])) {
              children.push({
                title: 'module.sidebar.menu-management.categories',
                path_url: CATEGORY_MANAGEMENT,
                icon: <ChartColumnStacked />,
              });
            }
            if (havePermissions(permissionsList, ['view.subcategory'])) {
              children.push({
                title: 'module.sidebar.menu-management.subcategories',
                path_url: SUBCATEGORY_MANAGEMENT,
                icon: <ChartColumnStacked />,
              });
            }
            return {
              title: 'module.sidebar.menu-management',
              path_url: MENU_MANAGEMENT,
              icon: <UtensilsCrossed />,
              children,
            };
          },
        },
        {
          codes: ['view.order'],
          item: {
            title: 'module.sidebar.order-management',
            path_url: ORDER_MANAGEMENT,
            icon: <HandPlatter />,
          },
        },
        {
          codes: ['view.request'],
          item: {
            title: 'module.sidebar.request',
            path_url: REQUEST,
            icon: <Bell />,
          },
        },
        {
          codes: ['view.branch', 'view.area'],
          item: {
            title: 'module.sidebar.branch',
            path_url: BRANCH,
            icon: <Building2 />,
          },
        },
        {
          codes: ['view.user', 'view.group'],
          item: {
            title: 'module.sidebar.staff-management',
            path_url: STAFF_MANAGEMENT,
            icon: <UserCog />,
          },
        },
      ];

      permissionMap.forEach(({ codes, item, withoutPermission }) => {
        if (havePermissions(permissionsList, codes) || withoutPermission) {
          businessOptions.push(typeof item === 'function' ? item() : item);
        }
      });
      return businessOptions;
    }
  }, [location.pathname, permissionsList]);

  // Create copies to avoid mutating the original arrays
  let displayMobileItems = [...mobileSidebarItems];
  const dropdownMobileItems: SidebarItem[] = [];

  if (displayMobileItems.length > 5) {
    // Use slice instead of splice to avoid mutating
    dropdownMobileItems.push(...displayMobileItems.slice(4));
    displayMobileItems = displayMobileItems.slice(0, 4);
  }

  if (isMobile) {
    return (
      <SidebarProvider defaultOpen={cookie === 'true'}>
        {/* Mobile Bottom Bar */}
        <MobileBottomBar items={displayMobileItems} dropdownItems={dropdownMobileItems} />
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
      <main className="w-full h-full flex flex-col items-center justify-center p-0 md:px-4 overflow-x-hidden">
        <div className="flex items-center justify-between w-full overflow-x-none">
          <SidebarTrigger />
          <Headers />
        </div>
        <Outlet />
      </main>
      <Toaster duration={3000} position="bottom-right" />
    </SidebarProvider>
  );
};

export default RootApp;
