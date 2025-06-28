import React from 'react';
import { useUsers } from '@/services/admin/business-owner-service';
import { useCreateUser } from '@/services/admin/business-owner-service';
import { type GroupResponse, useCreateGroup, useGroups } from '@/services/owner/group-service';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { createGroupSchema, createUserSchema } from '@/utils/schemas';
import CreateNewUser from './dialog/create-staff-dialog';
import CreateNewGroup from './group/dialog/create-group-dialog';
import type { GroupProps } from './group/tables/columns';
import GroupTable from './group/tables/page';
import type { UserProps } from './tables/columns';
import StaffTable from './tables/page';

const StaffManagement = () => {
  const { t } = useTranslation();
  const [staffData, setStaffData] = React.useState<UserProps[]>([]);
  const [groupData, setGroupData] = React.useState<GroupProps[]>([]);
  const [createUserDialog, setCreateUserDialog] = React.useState<boolean>(false);
  const [createGroupDialog, setCreateGroupDialog] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = React.useState<string>('users');
  const { groups } = useGroups();
  const { users } = useUsers({ page: 1, limit: 50 });
  const { createUser } = useCreateUser();
  const { createGroup } = useCreateGroup();

  React.useEffect(() => {
    if (users.length > 0) {
      setStaffData(
        users.map((user) => ({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          available: user.available,
          created_at: user.created_at,
          updated_at: user.updated_at,
        }))
      );
    }
  }, [users]);

  React.useEffect(() => {
    if (groups.length > 0) {
      setGroupData(
        groups.map((group: GroupResponse) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          permissions: group.permissions ?? [],
          created_at: group.created_at,
          updated_at: group.updated_at,
          users: group.users ?? [],
        }))
      );
    }
  }, [groups]);

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
        {selectedTab === 'users' ? (
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
        ) : (
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
      </div>
      {selectedTab === 'users' ? <StaffTable data={staffData} /> : <GroupTable data={groupData} />}
    </div>
  );
};

export default StaffManagement;
