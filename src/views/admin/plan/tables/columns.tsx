import React from 'react';
import { useDeletePlan, useUpdatePlan } from '@/services/admin/plan-service';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import CreateNewPlan from '../dialog/create-new-plan-dialog';
import ReadOnlyDialog from '../dialog/read-only-plan-dialog';

export type PlanType = {
  _id: string;
  name: string;
  price: number;
  period: number; // in days
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<PlanType>[] = [
  {
    accessorKey: 'index',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Plan Name',
    cell: ({ row }) => {
      return <p className="font-medium text-foreground text-sm">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'period',
    header: 'Period (days)',
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue('period') || 'No period'}</p>;
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = (row.getValue('price') as number) || 0;
      return (
        <p className="text-sm">
          {price ? `${price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : 'No price'}
        </p>
      );
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
      const [openViewDialog, setOpenViewDialog] = React.useState(false);
      const [openEditDialog, setOpenEditDialog] = React.useState(false);
      const { updatePlan } = useUpdatePlan();
      const { deletePlan } = useDeletePlan();
      const { t } = useTranslation();

      return (
        <div className="flex gap-2">
          <ReadOnlyDialog isOpen={openViewDialog} onClose={setOpenViewDialog} data={row.original}>
            <Button variant="outline" size="sm">
              <Eye className="mr-1" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyDialog>
          <CreateNewPlan
            create={false}
            initialData={row.original}
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            onSubmit={(data) => updatePlan({ id: row.original._id, data })}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-1" />
              {t('module.common.edit')}
            </Button>
          </CreateNewPlan>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deletePlan(row.original._id)}
          >
            <Button variant="destructive" size="sm">
              <Trash className="mr-1" />
              {t('module.common.delete')}
            </Button>
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
