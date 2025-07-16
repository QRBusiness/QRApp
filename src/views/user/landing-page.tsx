import { LOGIN } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">{t('module.landingPage.welcome')}</h1>
      <p className="text-lg text-muted-foreground mb-8">{t('module.landingPage.description')}</p>
      <Button size={'lg'} onClick={() => navigate(LOGIN)}>
        Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
