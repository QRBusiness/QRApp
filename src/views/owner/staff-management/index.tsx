import React from 'react';
import { STAFF_SWITCH_SELECT } from '@/constants';
import { useUsers } from '@/services/admin/business-owner-service';
import { useCreateUser } from '@/services/admin/business-owner-service';
import { useCreateGroup, useGroups } from '@/services/owner/group-service';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { useUserPermissions } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { createGroupSchema, createUserSchema } from '@/utils/schemas';
import { havePermissions, loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';
import CreateNewUser from './dialog/create-staff-dialog';
import CreateNewGroup from './group/dialog/create-group-dialog';
import GroupTable from './group/tables/page';
import StaffTable from './tables/page';

const StaffManagement = () => {
  const { t } = useTranslation();

  const { permissions } = useUserPermissions();
  const permissionCodes = permissions?.map((permission) => permission.code) || [];

  const [createUserDialog, setCreateUserDialog] = React.useState<boolean>(false);
  const [createGroupDialog, setCreateGroupDialog] = React.useState<boolean>(false);
  const prevSelectedTab = loadFromLocalStorage(STAFF_SWITCH_SELECT, 'users');
  const [selectedTab, setSelectedTab] = React.useState<string>(prevSelectedTab);
  const { groups } = useGroups();
  const { users } = useUsers({ page: 1, limit: 50 });
  const { createUser } = useCreateUser();
  const { createGroup } = useCreateGroup();

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    saveToLocalStorage(STAFF_SWITCH_SELECT, value);
  };

  return (
    <div className="w-full mx-auto pb-10 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
        {selectedTab === 'users' ? (
          <>
            {havePermissions(permissionCodes, ['create.user']) && (
              <CreateNewUser
                open={createUserDialog}
                onOpenChange={setCreateUserDialog}
                onSubmit={(values: z.infer<typeof createUserSchema>) => createUser(values)}
                create
              >
                <Button className="self-end flex items-center space-x-2">
                  <Plus className="size-4 md:size-5" />
                  {t('module.staffManagement.button.create')}
                </Button>
              </CreateNewUser>
            )}
          </>
        ) : (
          <>
            {havePermissions(permissionCodes, ['create.group']) && (
              <CreateNewGroup
                open={createGroupDialog}
                onOpenChange={setCreateGroupDialog}
                onSubmit={(values: z.infer<typeof createGroupSchema>) => createGroup(values)}
                create
              >
                <Button className="self-end flex items-center space-x-2">
                  <Plus className="size-4 md:size-5" />
                  {t('module.groupManagement.button.create')}
                </Button>
              </CreateNewGroup>
            )}
          </>
        )}
      </div>
      {selectedTab === 'users' ? (
        <StaffTable data={users.map((user) => ({ ...user, id: user._id }))} />
      ) : (
        <GroupTable data={groups} />
      )}
    </div>
  );
};

export default StaffManagement;
