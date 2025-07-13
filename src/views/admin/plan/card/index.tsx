import { Building2, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/views/owner/order-management/status/status-baged';
import { formattedDate } from '@/libs/utils';

export interface CardExtendPlanRequestProps {
  // Define any additional props if needed
  _id: string;
  businessName: string;
  planName: string;
  planPrice: number;
  planPeriod: number;
  imageUrl: string;
  paymentMethod: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const CardItem = ({ label, icon, value }: { label: string; icon: React.ReactNode; value: string | number }) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="text-foreground flex items-center space-x-2">
        {icon}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
};

export const CardExtendPlanRequest = (request: CardExtendPlanRequestProps) => {
  return (
    <Card className="grid grid-cols-5 p-2 relative">
      <div className="min-h-48 w-48 overflow-scroll-y overflow-x-hidden col-span-2">
        <img src={request.imageUrl} alt={request.planName} className="w-full h-full object-cover" />
      </div>
      <div className="p-2 col-span-3 space-y-1">
        <CardItem label="Business Name" value={request.businessName} icon={<Building2 className="size-4" />} />
        <CardItem label="Plan Name" value={request.planName} icon={<Package className="size-4" />} />
        <CardItem
          label="Plan Price"
          value={request.planPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          icon={<Package className="size-4" />}
        />
        <CardItem label="Plan Period" value={request.planPeriod + ' days'} icon={<Package className="size-4" />} />
        <CardItem label="Payment Method" value={request.paymentMethod} icon={<Package className="size-4" />} />
        <CardItem label="Created At" value={formattedDate(request.created_at)} icon={<Package className="size-4" />} />
        <CardItem label="Updated At" value={formattedDate(request.updated_at)} icon={<Package className="size-4" />} />
        <div className="flex w-full justify-end items-center">
          <Button className="self-end">
            <Check className="size-5" />
            Process Request
          </Button>
        </div>
        <div className="absolute left-1 top-1">
          <StatusBadge status={request.status as 'Unpaid' | 'Paid'} />
        </div>
      </div>
    </Card>
  );
};
