import React from 'react';
import { useToggleAvailabilityUser, useUpdateUser } from '@/services/admin/business-owner-service';
import type { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleX, Edit, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EditBusinessOwnerDialog from '@/views/admin/busines-owner-mgmt/edit/edit-business-owner-dialog';
import { formattedDate } from '@/libs/utils';
import ReadOnlyStaffDialog from '../dialog/read-only-staff-dialog';

export type UserProps = {
  id: string;
  name: string;
  address: string;
  phone: string;
  role: string;
  image_url?: string;
  available: boolean;
  username: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<UserProps>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      return <span className="text-base font-medium text-foreground">{row.getValue('username') || 'No Username'}</span>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },

  {
    accessorKey: 'phone',
    header: 'Contact',
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue('address') || 'No Address'}</span>;
    },
    maxSize: 150,
    size: 100,
    meta: {
      className: 'max-w-[200px] truncate',
    },
  },
  {
    accessorKey: 'available',
    header: 'Available',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-foreground px-2 py-1 text-sm rounded-2xl">
        {row.original.available === true ? (
          <CircleCheck className="fill-status-active mr-1" />
        ) : (
          <CircleX className="fill-status-inactive mr-1" />
        )}
        {row.original.available ? 'Available' : 'Unavailable'}
      </Badge>
    ),
  },
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | undefined;
      return imageUrl ? (
        <img src={imageUrl} alt="Business Owner" className="w-10 h-10 rounded-full" />
      ) : (
        <span className="text-sm text-gray-500">No Image</span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('created_at'));
    },
    enableHiding: true,
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('updated_at'));
    },
    enableHiding: true,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { t } = useTranslation();
      const [openEditDialog, setOpenEditDialog] = React.useState(false);
      const [openReadOnlyDialog, setOpenReadOnlyDialog] = React.useState(false);
      const { toggleAvailabilityUser } = useToggleAvailabilityUser();
      const { updateUser } = useUpdateUser();
      const initialData = {
        name: row.original.name,
        phone: row.original.phone,
        address: row.original.address,
        username: row.original.username,
        role: row.original.role,
        available: row.original.available,
      };

      return (
        <div className="flex gap-2">
          <ReadOnlyStaffDialog isOpen={openReadOnlyDialog} onClose={setOpenReadOnlyDialog} data={row.original}>
            <Button variant="outline" size="sm" onClick={() => setOpenReadOnlyDialog(true)}>
              <Eye className="mr-2" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyStaffDialog>
          <EditBusinessOwnerDialog
            isUser={true}
            initialData={initialData}
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            onSubmit={(data) => {
              updateUser({ id: row.original.id, data });
            }}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              {t('module.common.edit')}
            </Button>
          </EditBusinessOwnerDialog>
          <CustomAlertDialog
            title={t('module.common.confirmAction')}
            description={t('module.common.confirmActionDescription', {
              status: row.original.available ? 'disable' : 'enable',
              name: row.original.name,
            })}
            onSubmit={() => toggleAvailabilityUser(row.original.id)}
            variant={row.original.available ? 'destructive' : 'default'}
            buttonSubmitLabel={row.original.available ? t('module.common.disable') : t('module.common.enable')}
          >
            {row.original.available ? (
              <Button variant="destructive" size="sm">
                <CircleX className="mr-2" />
                {t('module.common.disable')}
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <CircleCheck className="mr-2" />
                {t('module.common.enable')}
              </Button>
            )}
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
