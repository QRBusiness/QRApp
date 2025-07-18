import React from 'react';
import type { OrderResponseProps } from '@/services/owner/order-service';
import { CircleUser, Clock, CreditCard, Info, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formattedDate } from '@/libs/utils';
import OrderDetailsDialog from '../details/order-details-dialog';
import StatusBadge from '../status/status-baged';

const CardOrderItem = ({ order }: { order: OrderResponseProps }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const orderCreatedAt = formattedDate(order.created_at, 'MMM dd, yyyy • h:mm a');
  const navigate = useNavigate();

  return (
    <Card key={order._id} className="py-2 flex flex-col justify-between h-full">
      <CardContent className="px-2 py-0">
        {/* Header card */}
        <div className="flex justify-between items-center p-1 bg-background relative">
          <div className="absolute top-0 right-0">
            <StatusBadge
              status={order.status as 'Cancelled' | 'Completed' | 'Pending' | 'Waiting' | 'Paid' | 'Unpaid'}
            />
          </div>

          <div className="flex flex-col items-start space-x-2 text-sm text-muted-foreground">
            <div className="font-medium text-muted-foreground">
              <div className="flex flex-row items-center space-x-2">
                <p>ID: </p> <p className="text-primary font-medium">{order._id}</p>
              </div>
            </div>
            <div className="flex items-center ">
              <MapPin className="inline size-4 mr-1" />
              <p>
                {order.area.name || 'Unknown Area'} - {order.service_unit.name || 'Unknown Unit'}
              </p>
            </div>
            <div className="flex items-center">
              <Clock className="inline size-4 mr-1" />
              {orderCreatedAt}
            </div>
          </div>
        </div>
        {/* Thông tin khách hàng */}
        <div className="px-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CircleUser className="size-5 text-muted-foreground" />
            <div className="font-semibold">{order.request.guest_name || 'Unknown'}</div>
          </div>
          <div className="flex flex-col items-start text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              {order.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
          <OrderDetailsDialog isOpen={isOpen} onOpenChange={setIsOpen} data={order}>
            <Button variant="secondary" size="sm" className="flex-1 items-center space-x-2">
              <Info className="size-4 md:size-5" />
              {t('module.orderManagement.orderCard.details')}
            </Button>
          </OrderDetailsDialog>
          {order.status !== 'Paid' && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 items-center space-x-2"
              onClick={() => navigate(order._id)}
            >
              <CreditCard className="size-4 md:size-5" />
              {t('module.orderManagement.orderCard.payment')}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardOrderItem;
