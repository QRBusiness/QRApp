import React from 'react';
import { useCreateOrderRequest } from '@/services/user/user-request-service';
import { useGuestState } from '@/components/common/states/guestState';
import { Button } from '@/components/ui/button';
import CreateRequestDialog from '../Menu/components/dialog/create-request-dialog';

const UserRequestPage = () => {
  const [openCreateRequestDialog, setOpenCreateRequestDialog] = React.useState<boolean>(false);
  const { area, table, name } = useGuestState();
  const { createOrderRequest } = useCreateOrderRequest();
  const handleSubmitRequest = async (values: string) => {
    await createOrderRequest({
      type: 'Request',
      reason: values,
      service_unit: table!,
      area: area!,
      guest_name: name,
      data: [],
    });
  };
  return (
    <div className="w-full px-2 mx-auto space-y flex flex-col items-center justify-between h-full space-y-4">
      <div className="flex flex-1 flex-col items-center justify-start w-full space-y-4">
        <h1 className="text-2xl font-bold">User Request Page</h1>
        <p>Call Staff for assistance</p>
        {/* Display order details here */}
      </div>
      <CreateRequestDialog
        open={openCreateRequestDialog}
        onOpenChange={setOpenCreateRequestDialog}
        onSubmit={(data) => handleSubmitRequest(data.request)}
      >
        <Button variant="default" className="w-full" onClick={() => setOpenCreateRequestDialog(true)}>
          Call Staff Assistance
        </Button>
      </CreateRequestDialog>
    </div>
  );
};

export default UserRequestPage;
