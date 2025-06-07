import AppBreadcrumb from './app-breadcurmb';

const Headers = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 text-foreground bg-red-300">
      <h1>AppName</h1>
      <AppBreadcrumb />
    </header>
  );
};

export default Headers;
