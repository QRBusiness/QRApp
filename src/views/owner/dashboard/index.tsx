import { useRefreshTokenService } from '@/services/authService';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add dashboard content here */}
      <Button onClick={() => useRefreshTokenService()}>Refresh</Button>
    </div>
  );
};

export default Dashboard;
