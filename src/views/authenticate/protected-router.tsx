import { LOGIN } from '@/constains';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserState } from '@/components/common/states/userState';

const ProtectedRoute = () => {
  const user = useUserState();
  const location = useLocation();

  if (!user._id) {
    return <Navigate to={LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
};
export default ProtectedRoute;
