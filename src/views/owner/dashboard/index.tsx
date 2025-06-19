import { useUserState } from '@/components/common/states/userState';

const Dashboard = () => {
  const user = useUserState();
  console.log({ user });
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
};

export default Dashboard;
