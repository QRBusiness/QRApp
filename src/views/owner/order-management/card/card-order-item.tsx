import { format } from 'date-fns';
import { CircleUser, Clock, Eye, HandPlatter, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import StatusBadge from '../status/status-baged';

export interface OrderItem {
  id: string;
  area: string;
  table: string;
  status: string;
  customer: {
    name: string;
  };
  createdAt: string;
  totalAmount: number;
  items: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    variant?: string;
    options?: string[];
    note?: string;
  }[];
}

const CardOrderItem = ({ order }: { order: OrderItem }) => {
  const { t } = useTranslation();
  const formattedDate = format(new Date(order.createdAt), 'h:mm a - MMM dd, yyyy');
  return (
    <Card key={order.id} className="py-2">
      <CardContent className="px-2 py-0">
        {/* Header card */}
        <div className="flex justify-between items-center p-2 bg-background">
          <div className="flex flex-col items-start space-x-2 text-sm text-muted-foreground">
            <div className="font-medium text-muted-foreground">
              <span className="text-primary texl-2xl font-medium">{order.id}</span>
            </div>
            <div className="flex items-center ">
              <MapPin className="inline size-4 mr-1" />
              <p>
                {order.area} - {order.table}
              </p>
            </div>
            <div className="flex items-center">
              <Clock className="inline size-4 mr-1" />
              {formattedDate}
            </div>
          </div>
          <StatusBadge status={order.status as 'Cancelled' | 'Completed' | 'Pending' | 'Waiting' | 'Paid'} />
        </div>
        {/* Thông tin khách hàng */}
        <div className="px-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CircleUser className="size-5" />
            <div className="font-normal">{order.customer.name}</div>
          </div>
          <div className="flex flex-col items-start text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              {order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>

            <span className="text-xs text-muted-foreground">
              {t('module.orderManagement.orderCard.items', { count: order.items.length })}
            </span>
          </div>
        </div>
        {/* Thông tin đơn hàng */}
        <div className="px-2 flex flex-col space-y-2">
          {/* Chi tiết đơn hàng */}
          <Accordion type="single" collapsible>
            <AccordionItem value="order-details">
              <AccordionTrigger className="text-sm font-medium text-muted-foreground flex items-center justify-between cursor-pointer">
                <p>{t('module.orderManagement.orderCard.orderDetails')}</p>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="italic font-medium">
                        {item.name}{' '}
                        <span className="text-xs text-muted-foreground">
                          {t('module.orderManagement.orderCard.items', { count: item.quantity })}
                        </span>
                      </div>
                      <div className="font-medium">
                        {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="px-2 bg-background">
        {/* Footer card */}
        <div className="flex justify-between space-x-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 items-center space-x-2">
            <HandPlatter className="size-4 md:size-5" />
            {t('module.orderManagement.orderCard.markReady')}
          </Button>
          <Button variant="outline" size="sm" className="flex-1 items-center space-x-2">
            <Eye className="size-4 md:size-5" />
            {t('module.orderManagement.orderCard.details')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardOrderItem;
