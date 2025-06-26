import React, { useEffect } from 'react';
import { useBranches, useCreateBranch } from '@/services/owner/branch-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import type { createBranchSchema } from '@/utils/schemas';
import CreateNewBranch from './dialog/create-branch-dialog';
import BranchTypeTable from './table';
import type { BranchType } from './table/columns';

const BranchManagement = () => {
  const { t } = useTranslation();
  const [data, setData] = React.useState<BranchType[]>([]);
  const { branches } = useBranches({ page: 1, limit: 50 });
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const { createBranch } = useCreateBranch();

  useEffect(() => {
    if (branches.length !== 0) {
      setData(
        branches.map((branch) => ({
          id: branch._id,
          name: branch.name,
          address: branch.address,
          contact: branch.contact,
          created_at: branch.created_at,
          updated_at: branch.updated_at,
        }))
      );
    }
  }, [branches]);

  const handleCreateBranch = async (formData: z.infer<typeof createBranchSchema>) => {
    await createBranch(formData);
  };

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="self-end">
        <CreateNewBranch open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSubmit={handleCreateBranch}>
          <Button variant="default">
            <CirclePlus className="mr-2 size-4 md:size-5" />
            {t('module.branchManagement.createNew')}
          </Button>
        </CreateNewBranch>
      </div>
      <BranchTypeTable data={data} />
    </div>
  );
};

export default BranchManagement;
