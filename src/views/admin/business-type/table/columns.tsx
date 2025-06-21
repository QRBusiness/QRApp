import React from 'react';
import { useDeleteBusinessType, useUpdateBusinessType } from '@/services/admin/business-type-service';
import type { ColumnDef } from '@tanstack/react-table';
import { Copy, Edit, Eye, EyeOff, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import CreateNewBusinessType from '../dialog/create-new-business-type';
import ReadOnlyDialog from '../dialog/read-only-dialog';

export type BusinessType = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<BusinessType>[] = [
  {
    accessorKey: 'index',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'id',
    header: 'Original ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const [isHidden, setIsHidden] = React.useState(true);
      const copyHandler = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID copied to clipboard');
      };
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{isHidden ? '* * * * * * *' : id}</span>
          <Hint label="Toggle ID Visibility">
            {isHidden ? (
              <EyeOff className="cursor-pointer size-5" onClick={() => setIsHidden(false)} />
            ) : (
              <Eye className="cursor-pointer size-5" onClick={() => setIsHidden(true)} />
            )}
          </Hint>
          <Hint label="Copy ID">
            <Copy className="cursor-pointer size-5" onClick={() => copyHandler(id)} />
          </Hint>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Business Name',
    cell: ({ row }) => {
      return <p className="font-medium text-foreground text-sm">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue('description') || 'No description'}</p>;
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
    cell: (row) => {
      const { t } = useTranslation();
      const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
      const [isViewOpen, setIsViewOpen] = React.useState(false);

      const { updateBusinessType } = useUpdateBusinessType();
      const { deleteBusinessType } = useDeleteBusinessType();

      const onSubmit = (data: { name: string; description: string }) => {
        updateBusinessType({ id: row.row.original.id, data });
        setIsUpdateOpen(false);
      };

      return (
        <div className="flex gap-2">
          <ReadOnlyDialog isOpen={isViewOpen} onClose={setIsViewOpen} data={row.row.original}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyDialog>
          <CreateNewBusinessType
            open={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
            create={false}
            onSubmit={onSubmit}
            initialData={{ name: row.row.original.name, description: row.row.original.description }}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              {t('module.common.edit')}
            </Button>
          </CreateNewBusinessType>
          <CustomAlertDialog
            title="Are you sure?"
            description="Are you sure to delete this business type? This process can not be undone."
            onSubmit={() => deleteBusinessType(row.row.original.id)}
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
