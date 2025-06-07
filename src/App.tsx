import { useMemo } from 'react';
import { FORGOT_PASSWORD, LOGIN } from '@/constains';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootApp from '@/components/common/root-app';
import ForgotPassword from '@/views/authenticate/forgot-password';
import Login from '@/views/authenticate/login';

function App() {
  const routers = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <RootApp />,
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
      ]),
    []
  );

  return <RouterProvider router={routers} />;
}

export default App;
