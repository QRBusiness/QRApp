import AppBreadcrumb from './app-breadcurmb';
import { ToggleChangeLanguage } from './toggle-change-language';

const Headers = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4">
      <AppBreadcrumb />
      <ToggleChangeLanguage />
    </header>
  );
};

export default Headers;
