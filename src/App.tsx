import { useMemo } from 'react';
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
import RootApp from '@/components/common/root-app';
import UnauthenticatedRootApp from '@/components/common/unauthenticated-root-app';
import ForgotPassword from '@/views/authenticate/forgot-password';
import Login from '@/views/authenticate/login';
import Dashboard from '@/views/dashboard';
import MenuManagement from '@/views/menu-management';
import OrderManager from '@/views/order-management';
import QRManagement from '@/views/qr-management';
import StaffManagement from '@/views/staff-management';
import { useResizeListener } from './components/common/states/viewState';
import CartItemsDetails from './views/menu-management/cart/cart-items-details';

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
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
