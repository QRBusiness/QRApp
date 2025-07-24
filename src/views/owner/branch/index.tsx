import React, { useEffect } from 'react';
import { BRANCH_AREA_SWITCH_SELECT } from '@/constants';
import { type AreaResponse, useAreas, useCreateArea } from '@/services/owner/area-service';
import { useBranches, useCreateBranch } from '@/services/owner/branch-service';
import { CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useUserPermissions } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { createBranchSchema } from '@/utils/schemas';
import { havePermissions, loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';
import CreateNewArea from './areas/dialog/create-new-area-dialog';
import type { AreaProps } from './areas/tables/columns';
import AreasTable from './areas/tables/page';
import CreateNewBranch from './dialog/create-branch-dialog';
import BranchTypeTable from './table';
import type { BranchType } from './table/columns';

const BranchManagement = () => {
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const permissionCodes = permissions.map((permission) => permission.code);
  const [selectedTab, setSelectedTab] = React.useState<string>(
    loadFromLocalStorage(BRANCH_AREA_SWITCH_SELECT, 'branch')
  );
  const [branchData, setBranchData] = React.useState<BranchType[]>([]);
  const [areaData, setAreaData] = React.useState<AreaProps[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const { branches } = useBranches({ page: 1, limit: 50 });
  const { areas } = useAreas({ page: 1, limit: 50 });
  const { createBranch } = useCreateBranch();
  const { createArea } = useCreateArea();

  useEffect(() => {
    if (branches.length !== 0) {
      setBranchData(
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

  useEffect(() => {
    if (areas.length !== 0) {
      setAreaData(
        areas.map((area: AreaResponse) => ({
          id: area._id,
          name: area.name,
          description: area.description,
          image_url: area.image_url,
          created_at: area.created_at,
          updated_at: area.updated_at,
          branch: {
            id: area.branch._id,
            name: area.branch.name,
            address: area.branch.address,
            contact: area.branch.contact,
            created_at: area.branch.created_at,
            updated_at: area.branch.updated_at,
          },
        }))
      );
    }
  }, [areas]);

  const handleCreateBranch = async (formData: z.infer<typeof createBranchSchema>) => {
    await createBranch(formData);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    saveToLocalStorage(BRANCH_AREA_SWITCH_SELECT, value);
  };

  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="w-full space-x-2">
            <TabsTrigger value="branch">Branch</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
        {selectedTab === 'branch' ? (
          <>
            {havePermissions(permissionCodes, ['create.branch']) && (
              <CreateNewBranch open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSubmit={handleCreateBranch}>
                <Button variant="default">
                  <CirclePlus className="mr-2 size-4 md:size-5" />
                  {t('module.branchManagement.createNew')}
                </Button>
              </CreateNewBranch>
            )}
          </>
        ) : (
          <>
            {havePermissions(permissionCodes, ['create.area']) && (
              <CreateNewArea open={openCreateDialog} onOpenChange={setOpenCreateDialog} onSubmit={createArea}>
                <Button variant="default">
                  <CirclePlus className="mr-2 size-4 md:size-5" />
                  {t('module.qrManagement.addAreaField.create')}
                </Button>
              </CreateNewArea>
            )}
          </>
        )}
      </div>
      {selectedTab === 'branch' ? <BranchTypeTable data={branchData} /> : <AreasTable data={areaData} />}
    </div>
  );
};

export default BranchManagement;
