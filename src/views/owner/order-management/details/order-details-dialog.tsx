import React from 'react';
import type { OrderResponseProps } from '@/services/owner/order-service';
import { Bell, Copy, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formattedDate } from '@/libs/utils';
import StatusBadge from '../status/status-baged';
import OrderCardDetails from './order-card';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  data: OrderResponseProps;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ isOpen, onOpenChange, children, data }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} key={data._id}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-9/10 max-h-9/10">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <Bell className="size-5" />
            Order Details
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <Info className="size-4 mr-2" />
            View the details of the order including items, status, and timestamps.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.id')}:</Label>
            <div className="flex gap-2 items-center">
              {data._id}
              <Hint label={t('module.common.readOnlyDialog.copyId')} side="right">
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(data._id)}>
                  <Copy className="size-4" />
                </Button>
              </Hint>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Status:</Label>
            <StatusBadge status={data.status as 'Waiting' | 'Unpaid' | 'Paid'} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Guest name:</Label>
            <p>{data.request.guest_name}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>Area:</Label>
            <p>{data.area.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>Table name:</Label>
            <p>{data.service_unit.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('module.common.readOnlyDialog.createdAt')}:</Label>
            <p>{formattedDate(data.created_at)}</p>
          </div>
          <OrderCardDetails order={data} />
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('module.common.readOnlyDialog.button')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
