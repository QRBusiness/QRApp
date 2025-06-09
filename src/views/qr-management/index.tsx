import CreateQR from './create-qr';
import QRTable from './table/page';

const QRManagement = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full p-4">
      <CreateQR />
      <QRTable />
    </div>
  );
};

export default QRManagement;
