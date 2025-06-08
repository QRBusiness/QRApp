import CreateQR from './create-qr';

const QRManagement = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full p-4">
      <CreateQR />
      <div>Table QR Code</div>
    </div>
  );
};

export default QRManagement;
