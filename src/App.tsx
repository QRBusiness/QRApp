import { Suspense, useMemo } from 'react';
import React from 'react';
import {
  ADMIN,
  ADMIN_ROLE,
  BRANCH,
  BUSINESS,
  BUSINESS_OWNER_MANAGEMENT,
  BUSINESS_TYPE,
  CART,
  CATEGORY_MANAGEMENT,
  CHECKOUT,
  DASHBOARD,
  FORGOT_PASSWORD,
  GROUP,
  LANDING_PAGE,
  LOGIN,
  MENU_MANAGEMENT,
  ORDER_MANAGEMENT,
  OWNER,
  OWNER_ROLE,
  PLAN,
  PROFILE,
  QR_MANAGEMENT,
  REQUEST,
  STAFF_MANAGEMENT,
  STAFF_ROLE,
  SUBCATEGORY_MANAGEMENT,
  UNAUTHORIZED,
} from '@/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Loading from '@/components/common/loading';
import { useResizeListener } from '@/components/common/states/viewState';
import webSocketService from '@/config/socket';

const RootApp = React.lazy(() => import('@/components/common/root-app'));
const GuestRouter = React.lazy(() => import('@/components/common/guest-router'));
const ForgotPassword = React.lazy(() => import('@/views/authenticate/forgot-password'));
const Login = React.lazy(() => import('@/views/authenticate/login'));
const Dashboard = React.lazy(() => import('@/views/owner/dashboard'));
const MenuManagement = React.lazy(() => import('@/views/owner/menu-management'));
const OrderManager = React.lazy(() => import('@/views/owner/order-management'));
const QRManagement = React.lazy(() => import('@/views/owner/qr-management'));
const StaffManagement = React.lazy(() => import('@/views/owner/staff-management'));
const LandingPage = React.lazy(() => import('@/views/user/landing-page'));
const ProtectedRoute = React.lazy(() => import('@/views/authenticate/protected-router'));
const BusinessOwnerManagement = React.lazy(() => import('@/views/admin/busines-owner-mgmt'));
const CreateNewBusinessOwner = React.lazy(
  () => import('@/views/admin/busines-owner-mgmt/create/create-new-business-owner')
);
const BranchManagement = React.lazy(() => import('@/views/owner/branch'));
const BusinessManagement = React.lazy(() => import('@/views/admin/business'));
const BusinessTypeManagement = React.lazy(() => import('@/views/admin/business-type'));
const GroupConfig = React.lazy(() => import('@/views/owner/staff-management/group'));
const UserCheckoutPage = React.lazy(() => import('@/views/user/Checkout'));
const UserCartPage = React.lazy(() => import('@/views/user/Cart'));
const UserMenuPage = React.lazy(() => import('@/views/user/Menu'));
const SubcategoryPage = React.lazy(() => import('@/views/owner/subcategories'));
const CategoryPage = React.lazy(() => import('@/views/owner/categories'));
const UserProfile = React.lazy(() => import('@/views/owner/user'));
const PaymentOrderPage = React.lazy(() => import('@/views/owner/order-management/payment'));
const RequestPage = React.lazy(() => import('@/views/owner/request'));
const PlanPage = React.lazy(() => import('@/views/admin/plan'));

const webSocketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000/ws';

webSocketService.connect(webSocketUrl);

function App() {
  const { t } = useTranslation();
  useResizeListener();
  const queryClient = new QueryClient();
  const routers = useMemo(
    () =>
      createBrowserRouter([
        // Unauthenticated routes
        {
          path: '*',
          element: <ProtectedRoute />,
        },
        {
          path: LANDING_PAGE,
          element: <LandingPage />,
        },
        {
          path: LOGIN,
          element: <Login />,
        },
        {
          path: FORGOT_PASSWORD,
          element: <ForgotPassword />,
        },
        {
          path: `${UNAUTHORIZED}/:businessId`,
          element: <GuestRouter />,
          children: [
            {
              index: true,
              element: <Navigate to={MENU_MANAGEMENT} replace />,
            },
            {
              path: MENU_MANAGEMENT,
              element: <UserMenuPage />,
            },
            {
              path: CART,
              element: <UserCartPage />,
            },
            {
              path: CHECKOUT,
              element: <UserCheckoutPage />,
            },
          ],
        },
        // Owner routes
        {
          path: `${OWNER}/:businessId`,
          element: <RootApp role={[OWNER_ROLE, STAFF_ROLE]} />,
          children: [
            {
              path: DASHBOARD,
              element: <Dashboard />,
            },
            {
              path: QR_MANAGEMENT,
              element: <QRManagement />,
            },
            {
              path: MENU_MANAGEMENT,
              element: <MenuManagement />,
            },
            {
              path: `${MENU_MANAGEMENT}/${CATEGORY_MANAGEMENT}`,
              element: <CategoryPage />,
            },
            {
              path: `${MENU_MANAGEMENT}/${SUBCATEGORY_MANAGEMENT}`,
              element: <SubcategoryPage />,
            },
            {
              path: ORDER_MANAGEMENT,
              element: <OrderManager />,
            },
            {
              path: `${ORDER_MANAGEMENT}/:id`,
              element: <PaymentOrderPage />,
            },
            {
              path: STAFF_MANAGEMENT,
              element: <StaffManagement />,
            },
            {
              path: `${STAFF_MANAGEMENT}/${GROUP}/:id`,
              element: <GroupConfig />,
            },
            {
              path: BRANCH,
              element: <BranchManagement />,
            },
            {
              path: PROFILE,
              element: <UserProfile />,
            },
            {
              path: REQUEST,
              element: <RequestPage />,
            },
          ],
        },
        // Admin routes
        {
          path: ADMIN,
          element: <RootApp role={[ADMIN_ROLE]} />,
          children: [
            {
              index: true,
              element: <Navigate to={BUSINESS_TYPE} replace />,
            },
            {
              path: BUSINESS_TYPE,
              element: <BusinessTypeManagement />,
            },
            {
              path: BUSINESS,
              element: <BusinessManagement />,
            },
            {
              path: BUSINESS_OWNER_MANAGEMENT,
              element: <BusinessOwnerManagement />,
            },
            {
              path: `${BUSINESS_OWNER_MANAGEMENT}/create`,
              element: <CreateNewBusinessOwner />,
            },
            {
              path: PROFILE,
              element: <UserProfile />,
            },
            {
              path: PLAN,
              element: <PlanPage />,
            },
          ],
        },
      ]),
    []
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <title>{t('module.app.name')}</title>
        <meta name="description" content={t('module.app.description')} />

        <Suspense fallback={<Loading />}>
          <RouterProvider router={routers} />
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default App;
