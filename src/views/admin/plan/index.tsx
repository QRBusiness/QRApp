import React from 'react';
import { useCreatePlan, usePlans } from '@/services/admin/plan-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import type { updatePlanSchema } from '@/utils/schemas';
import CreateNewPlan from './dialog/create-new-plan-dialog';
import type { PlanType } from './tables/columns';
import PlanManagementTable from './tables/page';

const PlanPage = () => {
  const { plans } = usePlans();
  const { t } = useTranslation();
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const { createPlan } = useCreatePlan();

  const handleCreatePlan = async (data: z.infer<typeof updatePlanSchema>) => {
    await createPlan({ name: data.name, period: data.period });
    setOpenCreateDialog(false);
  };
  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <CreateNewPlan open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSubmit={handleCreatePlan}>
          <Button variant="default">
            <CirclePlus className="mr-2 size-4 md:size-5" />
            {t('module.plan.action.createNew')}
          </Button>
        </CreateNewPlan>
      </div>
      <PlanManagementTable data={plans as PlanType[]} />
    </div>
  );
};
export default PlanPage;
