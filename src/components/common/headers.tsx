import { useIsMobile } from '@/hooks/use-mobile';
import AppBreadcrumb from './app-breadcurmb';
import { ToggleChangeLanguage } from './toggle-change-language';

const Headers = () => {
  const isMobile = useIsMobile();
  return (
    <header className="w-full h-16 flex items-center justify-between px-4">
      <AppBreadcrumb />
      {!isMobile && <ToggleChangeLanguage />}
    </header>
  );
};

export default Headers;
