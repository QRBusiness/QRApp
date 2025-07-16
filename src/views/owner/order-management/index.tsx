import { useTranslation } from 'react-i18next';
import CardOrders from './card/card-orders';
import RequestBar from './request';

const OrderManager = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full p-4 mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-xl font-semibold">{t('module.order.unassignedRequestSession')}</h1>
        <RequestBar />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('module.order.orderSession')}</h2>
        <CardOrders />
      </div>
    </div>
  );
};

export default OrderManager;
