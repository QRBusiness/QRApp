import CreateQR from './create/create-qr';
import MobileTable from './mobile-card';
import QRTable from './table/page';

const QRManagement = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full px-0 md:p-4">
      {/* desktop view */}
      <div className="hidden md:block w-full">
        <CreateQR />
        <QRTable />
      </div>
      {/* mobile view */}
      <div className="block md:hidden w-full">
        <MobileTable />
      </div>
    </div>
  );
};

export default QRManagement;
