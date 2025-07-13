import React from 'react';
import { useBusiness } from '@/services/admin/business-service';
import { useCreatePlan, usePlans } from '@/services/admin/plan-service';
import { useExtendedRequests } from '@/services/owner/request-service';
import { ChevronLeft, CirclePlus, FunnelPlus, FunnelX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import type { updatePlanSchema } from '@/utils/schemas';
import { CustomVariantsSelect } from '@/views/owner/menu-management/dialog/custom-variants-select';
import { CardExtendPlanRequest } from './card';
import CreateNewPlan from './dialog/create-new-plan-dialog';
import type { PlanType } from './tables/columns';
import PlanManagementTable from './tables/page';

const PlanPage = () => {
  const { t } = useTranslation();
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const { business } = useBusiness({ page: 1, limit: 50 });
  const { extendedRequests } = useExtendedRequests();
  const { plans } = usePlans();
  const { createPlan } = useCreatePlan();

  const [selectedStatus, setSelectedStatus] = React.useState<string>('Unpaid');
  const statusOptions = React.useMemo(() => {
    return [
      {
        value: 'Unpaid',
        label: 'Unpaid',
      },
      {
        value: 'Paid',
        label: 'Paid',
      },
    ];
  }, []);
  const handleClearFilters = () => {
    setSelectedStatus('');
  };

  const handleCreatePlan = async (data: z.infer<typeof updatePlanSchema>) => {
    await createPlan({ name: data.name, period: data.period });
    setOpenCreateDialog(false);
  };
  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <Collapsible className="group/collapsible" defaultOpen={false} key={'create-qr-collapsible'}>
        <CollapsibleTrigger>
          <Button variant="secondary">
            {t('module.plan.table-session')}
            <ChevronLeft className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          <div className="self-end">
            <CreateNewPlan open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSubmit={handleCreatePlan}>
              <Button variant="default">
                <CirclePlus className="mr-2 size-4 md:size-5" />
                {t('module.plan.action.createNew')}
              </Button>
            </CreateNewPlan>
          </div>
          <PlanManagementTable data={plans as PlanType[]} />
        </CollapsibleContent>
      </Collapsible>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 justify-center items-center">
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
                placeholder="Select Status"
              />
            </div>
          </div>
        </div>
        {extendedRequests
          .filter((request) => request.status === selectedStatus)
          .map((request) => {
            const businessName = business[business.findIndex((b) => b._id === request.business.id)]?.name || '';
            const selectedPlan = plans.find((p) => p._id === request.plan.id);

            return (
              <CardExtendPlanRequest
                key={request._id}
                _id={request._id}
                businessName={businessName}
                planName={selectedPlan?.name || ''}
                planPrice={selectedPlan?.price || 0}
                planPeriod={selectedPlan?.period || 0}
                imageUrl={request.image}
                paymentMethod={request.payment_method}
                status={request.status}
                created_at={request.created_at}
                updated_at={request.updated_at}
              />
            );
          })}
      </div>
    </div>
  );
};
export default PlanPage;
