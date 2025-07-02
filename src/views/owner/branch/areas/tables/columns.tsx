import React from 'react';
import { useDeleteArea, useUpdateArea } from '@/services/owner/area-service';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import type { BranchType } from '../../table/columns';
import CreateNewArea from '../dialog/create-new-area-dialog';
import ReadOnlyDialog from '../dialog/read-only-area-dialog';

export type AreaProps = {
  id: string;
  name: string;
  description: string;
  branch: BranchType;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<AreaProps>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Area Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue('description') || 'No description provided'}</p>;
    },
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
    cell: ({ row }) => {
      const branch: BranchType = row.getValue('branch');
      return <p className="text-sm">{branch.name || 'Unknown'}</p>;
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
      const { updateArea } = useUpdateArea();
      const { deleteArea } = useDeleteArea();

      return (
        <div className="flex gap-2">
          <ReadOnlyDialog data={row.original} isOpen={openViewDialog} onClose={setOpenViewDialog}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyDialog>
          <CreateNewArea
            create={false}
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            initialData={{
              name: row.original.name,
              description: row.original.description,
              branch: row.original.branch.id,
              image_url: row.original.image_url,
            }}
            onSubmit={(values) => updateArea({ id: row.original.id, data: values })}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              {t('module.common.edit')}
            </Button>
          </CreateNewArea>

          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deleteArea(row.original.id)}
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
