import type { OrderResponseProps } from '@/services/owner/order-service';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const OrderCardDetails = ({ order }: { order: OrderResponseProps }) => {
  const { t } = useTranslation();
  return (
    <ScrollArea className="h-96 md:h-[400px] mt-4">
      <div className={'space-y-2'}>
        {order.items.map((item) => (
          <Card key={`${order._id + item.name}`} className="p-1 border shadow-sm">
            <div className="gap-2 flex">
              <div className="w-20 h-20 flex-shrink-0">
                <img src={item.img_url} alt={item.name} className="w-full h-full object-cover rounded-md object-top" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start space-x-2">
                  <h3 className="font-medium text-black">{item.name}</h3>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('module.menuManagement.cart.size')}:{' '}
                    <span className="font-medium text-black">{item.variant}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('module.menuManagement.cart.quantity')}:{' '}
                    <span className="font-medium text-black">{item.quantity}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t('module.menuManagement.cart.price')}:{' '}
                    <span className="font-medium text-black">{item.price}</span>
                  </div>
                </div>

                {item.options && item.options.length > 0 && (
                  <div className="flex flex-row gap-1 my-2">
                    {item.options.map((opt) => (
                      <Badge key={opt} variant="outline" className="text-xs text-muted-foreground col-span-1">
                        {opt}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.note && <p className="text-xs text-muted-foreground mt-1 italic">"{item.note}"</p>}
                <div className="flex justify-between items-center mt-3">
                  <div className="text-right text-primary">
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default OrderCardDetails;
