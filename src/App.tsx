import { Suspense, useMemo } from 'react';
import React from 'react';
import {
  DASHBOARD,
  FORGOT_PASSWORD,
  LOGIN,
  MENU_MANAGEMENT,
  ORDER_MANAGEMENT,
  QR_MANAGEMENT,
  STAFF_MANAGEMENT,
  UNAUTHENTICATED,
} from '@/constains';
import { useTranslation } from 'react-i18next';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Loading from './components/common/loading';
import { useResizeListener } from './components/common/states/viewState';

const RootApp = React.lazy(() => import('@/components/common/root-app'));
const UnauthenticatedRootApp = React.lazy(() => import('@/components/common/unauthenticated-root-app'));
const ForgotPassword = React.lazy(() => import('@/views/authenticate/forgot-password'));
const Login = React.lazy(() => import('@/views/authenticate/login'));
const Dashboard = React.lazy(() => import('@/views/dashboard'));
const MenuManagement = React.lazy(() => import('@/views/menu-management'));
const CartItemsDetails = React.lazy(() => import('@/views/menu-management/cart/cart-items-details'));
const OrderManager = React.lazy(() => import('@/views/order-management'));
const QRManagement = React.lazy(() => import('@/views/qr-management'));
const StaffManagement = React.lazy(() => import('@/views/staff-management'));
const OrderDetails = React.lazy(() => import('./views/order-management/details'));

function App() {
  const { t } = useTranslation();
  useResizeListener();
  const routers = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootApp />,
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
              path: MENU_MANAGEMENT + '/cart',
              element: <CartItemsDetails />,
            },
            {
              path: ORDER_MANAGEMENT,
              element: <OrderManager />,
            },
            {
              path: ORDER_MANAGEMENT + '/:id',
              element: <OrderDetails />,
            },
            {
              path: STAFF_MANAGEMENT,
              element: <StaffManagement />,
            },
          ],
        },
        {
          path: UNAUTHENTICATED,
          element: <UnauthenticatedRootApp />,
          children: [
            {
              path: LOGIN,
              element: <Login />,
            },
            {
              path: FORGOT_PASSWORD,
              element: <ForgotPassword />,
            },
          ],
        },
        {
          path: '*',
          element: <Navigate to={`${UNAUTHENTICATED}/${LOGIN}`} replace />,
        },
      ]),
    []
  );

  return (
    <>
      <title>{t('module.app.name')}</title>
      <meta name="description" content={t('module.app.description')} />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={routers} />
      </Suspense>
    </>
  );
}

export default App;
