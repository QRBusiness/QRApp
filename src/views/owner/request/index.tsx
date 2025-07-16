import React from 'react';
import { useRequests } from '@/services/owner/request-service';
import { FunnelPlus, FunnelX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CustomVariantsSelect } from '../menu-management/dialog/custom-variants-select';
import CartRequest from '../order-management/card/cart-request';

const RequestPage = () => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('Waiting');
  const { requests } = useRequests({ status: selectedStatus, type: 'Request' });
  const statusOptions = React.useMemo(() => {
    return [
      {
        value: 'Waiting',
        label: 'Waiting',
      },
      {
        value: 'Completed',
        label: 'Completed',
      },
    ];
  }, []);
  const handleClearFilters = () => {
    setSelectedStatus('');
  };
  return (
    <div className="flex flex-col gap-4 p-2 md:p-4 w-full mx-auto">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex items-start justify-start gap-2 flex-col p-3 border rounded-lg">
        <div className="flex items-center justify-between space-x-2 w-full">
          <div className="flex items-center space-x-2">
            <FunnelPlus className="size-4 md:size-5" />
            <Label className="font-semibold text-base ">Filters Options</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="destructive" size="sm" onClick={handleClearFilters} disabled={selectedStatus === ''}>
              <FunnelX className="size-4 md:size-5" />
              Clear Filters
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col items-start justify-center space-y-2">
            <Label className="text-muted-foreground">Status Filter</Label>
            <CustomVariantsSelect
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder={t('module.placeholders.selectStatus')}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
        {requests.map((request) => (
          <CartRequest
            key={request._id}
            _id={request._id}
            created_at={request.created_at}
            updated_at={request.updated_at}
            type={request.type}
            reason={request.reason}
            status={request.status}
            area={request.area}
            service_unit={request.service_unit}
            guest_name={request.guest_name}
          />
        ))}
      </div>
    </div>
  );
};
export default RequestPage;
