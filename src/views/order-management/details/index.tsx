import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Order Details</h1>
      <p className="text-muted-foreground">This is the order details page for order ID: {id}</p>
      {/* Add more content here as needed */}
    </div>
  );
};

export default OrderDetails;
