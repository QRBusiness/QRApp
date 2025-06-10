import { useParams } from 'react-router-dom';

const QRDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>QR Code ID: {id}</h1>
      {/* Additional details and components can be added here */}
    </div>
  );
};

export default QRDetails;
