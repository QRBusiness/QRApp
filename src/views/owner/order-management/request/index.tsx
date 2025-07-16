import { useRequests } from '@/services/owner/request-service';
import { useTranslation } from 'react-i18next';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CardRequestOrder from '../card/cart-request-order';

const RequestBar = () => {
  const { t } = useTranslation();
  const { requests } = useRequests({ status: 'Waiting', type: 'Order' });
  if (!requests || requests.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4">
        <p className="text-center text-muted-foreground">{t('module.request.noRequestAvailable')}</p>
      </div>
    );
  }
  return (
    <ScrollArea className="w-full h-full p-4">
      <div className="flex flex-row gap-2">
        {requests.map((request) => (
          <CardRequestOrder key={request._id} order={request} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default RequestBar;
