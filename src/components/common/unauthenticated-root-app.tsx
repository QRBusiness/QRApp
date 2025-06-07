import { Outlet } from 'react-router-dom';

const UnauthenticatedRootApp = () => {
  return (
    <header>
      <h1>Unauthenticated Root App</h1>
      {/* Add unauthenticated root app content here */}
      <main className="px-4 py-8 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </header>
  );
};

export default UnauthenticatedRootApp;
// This component serves as a placeholder for the unauthenticated root app.
