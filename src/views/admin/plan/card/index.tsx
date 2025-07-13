import React from 'react';
import { useExtendExpiration } from '@/services/admin/business-service';
import { useProcessExtendedRequest } from '@/services/owner/request-service';
import { Building2, CalendarPlus2, Check, CircleDollarSign, CreditCard, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/views/owner/order-management/status/status-baged';
import ImagePopUp from '../dialog/view-image-payment-dialog';

export interface CardExtendPlanRequestProps {
  // Define any additional props if needed
  _id: string;
  businessName: string;
  businessId: string;
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
        <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
      </div>
      <div className="font-semibold text-sm truncate">{value}</div>
    </div>
  );
};

export const CardExtendPlanRequest = (request: CardExtendPlanRequestProps) => {
  const [openImageDialog, setOpenImageDialog] = React.useState(false);

  const { extendExpiration } = useExtendExpiration();
  const { processExtendedRequest } = useProcessExtendedRequest();
  const handleProcessRequest = async () => {
    // Implement the logic to process the request
    await extendExpiration({
      id: request.businessId,
      days: request.planPeriod,
    });
    await processExtendedRequest(request._id);
  };
  return (
    <Card className="grid grid-cols-5 p-2 relative">
      <div className="2xl:h-44 2xl:w-44 3xl:h-48 3xl:w-48 overflow-scroll-y overflow-x-hidden col-span-2">
        <img src={request.imageUrl} alt={request.planName} className="w-full h-full object-cover" />
      </div>
      <div className="p-2 col-span-3 space-y-1 bg-background text-foreground">
        <CardItem label="Business's Name" value={request.businessName} icon={<Building2 className="size-4" />} />
        <CardItem label="Plan Name" value={request.planName} icon={<Package className="size-4" />} />
        <CardItem
          label="Plan Price"
          value={request.planPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          icon={<CircleDollarSign className="size-4" />}
        />
        <CardItem
          label="Plan Period"
          value={request.planPeriod + ' days'}
          icon={<CalendarPlus2 className="size-4" />}
        />
        <CardItem label="Payment Method" value={request.paymentMethod} icon={<CreditCard className="size-4" />} />
        <div className="flex w-full justify-end items-center mt-4">
          <ImagePopUp
            open={openImageDialog}
            openChange={setOpenImageDialog}
            title={request.planName}
            description={`Business "${request.businessName}" plan extension request with ${request.planPeriod} days`}
            url={request.imageUrl}
          >
            <Button className="self-end mr-2" variant="secondary">
              <Eye className="size-5" />
              View
            </Button>
          </ImagePopUp>
          <Button className="self-end" onClick={handleProcessRequest} variant="default">
            <Check className="size-5" />
            Confirm Paid
          </Button>
        </div>
        <div className="absolute left-1 top-1">
          <StatusBadge status={request.status as 'Unpaid' | 'Paid'} />
        </div>
      </div>
    </Card>
  );
};
