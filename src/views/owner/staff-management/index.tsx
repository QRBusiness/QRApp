import React from 'react';
import { useUsers } from '@/services/admin/business-owner-service';
import { useCreateUser } from '@/services/admin/business-owner-service';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import type { createUserSchema } from '@/utils/schemas';
import CreateNewUser from './dialog/create-staff-dialog';
import type { UserProps } from './tables/columns';
import StaffTable from './tables/page';

const StaffManagement = () => {
  const { t } = useTranslation();
  const [data, setData] = React.useState<UserProps[]>([]);
  const [createDialog, setCreateDialog] = React.useState<boolean>(false);
  const { users } = useUsers({ page: 1, limit: 50 });
  const { createUser } = useCreateUser();

  React.useEffect(() => {
    if (users.length > 0) {
      setData(
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

  return (
    <div className="container mx-auto pb-10 flex flex-col space-y-4">
      <CreateNewUser
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSubmit={(values: z.infer<typeof createUserSchema>) => createUser(values)}
        create
      >
        <Button className="self-end flex items-center space-x-2">
          <Plus className="size-4 md:size-5" />
          {t('module.staffManagement.button.create')}
        </Button>
      </CreateNewUser>
      <StaffTable data={data} />
    </div>
  );
};

export default StaffManagement;
