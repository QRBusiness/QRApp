import React from 'react';
import { useDeleteBranch, useUpdateBranch } from '@/services/owner/branchService';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type z from 'zod';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Button } from '@/components/ui/button';
import type { createBranchSchema } from '@/utils/schemas';
import { formattedDate } from '@/libs/utils';
import CreateNewBranch from '../dialog/create-branch-dialog';
import ReadOnlyDialog from '../dialog/read-only-branch-dialog';

export type BranchType = {
  id: string;
  name: string;
  address: string;
  contact: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<BranchType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Branch Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue('address') || 'No address provided'}</p>;
    },
  },
  {
    accessorKey: 'contact',
    header: 'Contact Number',
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue('contact') || 'No contact info'}</p>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('created_at'));
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      return formattedDate(row.getValue('updated_at'));
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { t } = useTranslation();
      const [openEditDialog, setOpenEditDialog] = React.useState(false);
      const [openViewDialog, setOpenViewDialog] = React.useState(false);
      const { updateBranch } = useUpdateBranch();
      const { deleteBranch } = useDeleteBranch();

      const handleUpdateBranch = async (formData: z.infer<typeof createBranchSchema>) => {
        await updateBranch({ id: row.original.id, branchData: formData });
        setOpenEditDialog(false);
      };
      return (
        <div className="flex gap-2">
          <ReadOnlyDialog isOpen={openViewDialog} onClose={setOpenViewDialog} data={row.original}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyDialog>
          <CreateNewBranch
            create={false}
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            initialData={row.original}
            onSubmit={handleUpdateBranch}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              {t('module.common.edit')}
            </Button>
          </CreateNewBranch>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deleteBranch(row.original.id)}
          >
            <Button variant="destructive" size="sm">
              <Trash className="mr-2" />
              {t('module.qrManagement.alertDialog.confirmButton')}
            </Button>
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
