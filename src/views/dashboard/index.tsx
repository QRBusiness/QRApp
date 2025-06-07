import { Hint } from '@/components/common/hint';

const Dashboard = () => {
  return (
    <div>
      <Hint label="This is a hint">
        <button>Hover over me</button>
      </Hint>
      <h1>Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
};

export default Dashboard;
