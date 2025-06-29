import { LOGIN } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Landing Page</h1>
      <p className="text-lg text-muted-foreground mb-8">This is a placeholder for the landing page content.</p>
      <Button size={'lg'} onClick={() => navigate(LOGIN)}>
        Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
