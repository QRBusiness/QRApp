import { Outlet } from 'react-router-dom';

const GuestRouter = () => {
  return (
    <header>
      <h1>Guest Router</h1>
      {/* Add guest router content here */}
      <main className="px-4 py-8 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </header>
  );
};

export default GuestRouter;
// This component serves as a placeholder for the guest router.
