import { format } from 'date-fns';
import { Clock, Eye, HandPlatter, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface OrderItem {
  id: string;
  area: string;
  table: string;
  status: string;
  customer: {
    name: string;
  };
  createdAt: string;
  totalAmount: string;
  items: {
    name: string;
    quantity: number;
    price: string;
    size: 'L' | 'M' | 'S'; // Assuming size is one of these values
    options?: {
      option: string;
      price: number;
    }[];
    notes?: string;
  }[];
}

const CardOrderItem = ({ order }: { order: OrderItem }) => {
  const { t } = useTranslation();
  const formattedDate = format(new Date(order.createdAt), 'MMM dd, yyyy • h:mm a');
  return (
    <Card key={order.id} className="cursor-pointer p-2 gap-4 flex flex-col justify-between w-full">
      {/* Header card */}
      <div className="flex justify-between items-center p-2 border-b bg-background">
        <div className="flex items-center space-x-2">
          <div className="font-medium text-muted-foreground">
            {t('module.orderManagement.orderCard.order')}: <span className="text-primary">{order.id}</span>
          </div>
        </div>
        <Badge variant="default" className="capitalize ml-2">
          {order.status}
        </Badge>
      </div>
      {/* Thông tin khách hàng */}
      <div className="p-2 flex justify-between items-center border-b border rounded-md bg-muted">
        <div className="flex items-center space-x-2">
          <User className="size-6" />
          <div className="font-medium text-black">{order.customer.name}</div>
        </div>
        <div className="text-muted-foreground font-medium">| {order.table}</div>
      </div>
      {/* Thông tin đơn hàng */}
      <div className="p-2 flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="inline size-4 mr-1" />
            {formattedDate}
          </div>
          <div className="text-sm text-muted-foreground">
            <span>{t('module.orderManagement.orderCard.items', { count: order.items.length })}</span>
          </div>
        </div>
        {/* Chi tiết đơn hàng */}
        <Accordion type="single" collapsible>
          <AccordionItem value="order-details">
            <AccordionTrigger className="text-sm font-medium text-muted-foreground flex items-center justify-between">
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
                    <div className="font-medium">{item.price}</div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
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
    </Card>
  );
};

export default CardOrderItem;
