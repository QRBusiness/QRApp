import { Suspense, useMemo } from 'react';
import React from 'react';
import {
  ADMIN,
  ADMIN_ROLE,
  BRANCH,
  BUSINESS,
  BUSINESS_OWNER_MANAGEMENT,
  CART,
  DASHBOARD,
  FORGOT_PASSWORD,
  LANDING_PAGE,
  LOGIN,
  MENU_MANAGEMENT,
  ORDER_MANAGEMENT,
  OWNER,
  OWNER_ROLE,
  QR_MANAGEMENT,
  STAFF_MANAGEMENT,
  UNAUTHORIZED,
} from '@/constains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Loading from '@/components/common/loading';
import { useResizeListener } from '@/components/common/states/viewState';
import { Toaster } from '@/components/ui/sonner';
import BranchManagement from '@/views/admin/branch';
import BusinessOwnerManagement from '@/views/admin/busines-owner-mgmt';
import BusinessManagement from '@/views/admin/business';

const RootApp = React.lazy(() => import('@/components/common/root-app'));
const GuestRouter = React.lazy(() => import('@/components/common/guest-router'));
const ForgotPassword = React.lazy(() => import('@/views/authenticate/forgot-password'));
const Login = React.lazy(() => import('@/views/authenticate/login'));
const Dashboard = React.lazy(() => import('@/views/owner/dashboard'));
const MenuManagement = React.lazy(() => import('@/views/owner/menu-management'));
const CartItemsDetails = React.lazy(() => import('@/views/owner/menu-management/cart/cart-items-details'));
const OrderManager = React.lazy(() => import('@/views/owner/order-management'));
const QRManagement = React.lazy(() => import('@/views/owner/qr-management'));
const StaffManagement = React.lazy(() => import('@/views/owner/staff-management'));
const OrderDetails = React.lazy(() => import('@/views/owner/order-management/details'));
const LandingPage = React.lazy(() => import('@/views/user/landing-page'));
const ProtectedRoute = React.lazy(() => import('@/views/authenticate/protected-router'));

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
              element: <MenuManagement />,
            },
            {
              path: CART,
              element: <CartItemsDetails />,
            },
            {
              path: ORDER_MANAGEMENT,
              element: <OrderManager />,
            },
            {
              path: `${ORDER_MANAGEMENT}/:id`,
              element: <OrderDetails />,
            },
          ],
        },
        // Owner routes
        {
          path: `${OWNER}/:businessId`,
          element: <RootApp role={OWNER_ROLE} />,
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
              path: CART,
              element: <CartItemsDetails />,
            },
            {
              path: ORDER_MANAGEMENT,
              element: <OrderManager />,
            },
            {
              path: `${ORDER_MANAGEMENT}/:id`,
              element: <OrderDetails />,
            },
            {
              path: STAFF_MANAGEMENT,
              element: <StaffManagement />,
            },
          ],
        },
        // Admin routes
        {
          path: `${ADMIN}/:businessId`,
          element: <RootApp role={ADMIN_ROLE} />,
          children: [
            {
              path: BRANCH,
              element: <BranchManagement />,
            },
            {
              path: BUSINESS,
              element: <BusinessManagement />,
            },
            {
              path: BUSINESS_OWNER_MANAGEMENT,
              element: <BusinessOwnerManagement />,
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
        <Toaster duration={3000} position="bottom-right" />
        <Suspense fallback={<Loading />}>
          <RouterProvider router={routers} />
        </Suspense>
      </QueryClientProvider>
    </>
  );
}

export default App;
