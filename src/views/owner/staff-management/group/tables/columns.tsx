import React from 'react';
import { GROUP } from '@/constants';
import type { User } from '@/services/admin/business-owner-service';
import { type Permission, useDeleteGroup, useUpdateGroup } from '@/services/owner/group-service';
import type { ColumnDef } from '@tanstack/react-table';
import { CircleArrowOutDownRight, Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import CreateNewGroup from '../dialog/create-group-dialog';
import ReadOnlyGroupDialog from '../dialog/read-only-group-dialog';

export type GroupProps = {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: User[];
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<GroupProps>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Group Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const permissions: Array<Permission> = row.getValue('permissions') || [];
      return (
        <div className="flex flex-wrap gap-2">
          {permissions.map((permission: Permission, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {permission.description}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'users',
    header: 'Users',
    cell: ({ row }) => {
      const users: Array<User> = row.getValue('users') || [];
      return (
        <div className="flex flex-wrap gap-2">
          {users.map((user: User, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {user.name}
            </Badge>
          ))}
        </div>
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
      const navigate = useNavigate();
      const [editGroupDialog, setEditGroupDialog] = React.useState<boolean>(false);
      const [viewGroupDialog, setViewGroupDialog] = React.useState<boolean>(false);
      const { updateGroup } = useUpdateGroup(); // Assuming you have a hook for updating groups
      const { deleteGroup } = useDeleteGroup(); // Assuming you have a hook for deleting groups

      return (
        <div className="flex gap-2">
          <ReadOnlyGroupDialog
            isOpen={viewGroupDialog}
            onClose={setViewGroupDialog}
            data={{
              _id: row.original._id,
              name: row.original.name,
              description: row.original.description,
              created_at: row.original.created_at,
              updated_at: row.original.updated_at,
            }}
          >
            <Button variant="outline" size="sm">
              <Eye className="mr-2" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyGroupDialog>
          <CreateNewGroup
            open={editGroupDialog}
            onOpenChange={setEditGroupDialog}
            create={false}
            initialData={row.original}
            onSubmit={(data) => {
              updateGroup({ data, id: row.original._id });
            }}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              {t('module.common.edit')}
            </Button>
          </CreateNewGroup>
          <Button variant="outline" size="sm" onClick={() => navigate(`${GROUP}/${row.original._id}`)}>
            <CircleArrowOutDownRight className="mr-2" />
            {t('module.common.more')}
          </Button>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deleteGroup(row.original._id)}
          >
            <Button variant="destructive" size="sm">
              <Trash className="mr-2" />
              {t('module.common.delete')}
            </Button>
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
