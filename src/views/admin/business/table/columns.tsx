import React from 'react';
import { useExtendExpiration, useToggleAvailableBusiness } from '@/services/admin/business-service';
import { useBusinessTypes } from '@/services/admin/business-type-service';
import { usePlans } from '@/services/admin/plan-service';
import type { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleX, ClockPlus, Edit, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import EditBusinessDialog from '../dialog/edit-business-dialog';
import ExtendExpireDateDialog from '../dialog/extend-expire-date-dialog';
import ReadOnlyBusinessDialog from '../dialog/read-only-business-dialog';

export type BusinessType = {
  id: string;
  name: string;
  business_type: string;
  address: string;
  contact: string;
  tax_code: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  expired_at: string;
};

export const columns: ColumnDef<BusinessType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
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
    accessorKey: 'business_type',
    header: 'Business Type',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'contact',
    header: 'Contact Number',
  },
  {
    accessorKey: 'tax_code',
    header: 'Tax Code',
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
    accessorKey: 'expired_at',
    header: 'Expired At',
    cell: ({ row }) => {
      const expiredAt = row.getValue('expired_at');
      return expiredAt ? formattedDate(expiredAt as string) : 'N/A';
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { t } = useTranslation();
      const [openEditDialog, setOpenEditDialog] = React.useState(false);
      const [openViewDialog, setOpenViewDialog] = React.useState(false);
      const [openExtendDialog, setOpenExtendDialog] = React.useState(false);

      const { plans } = usePlans();
      const { toggleAvailableBusiness } = useToggleAvailableBusiness();
      const { businessTypes } = useBusinessTypes({ page: 1, limit: 50 });
      const { extendExpiration } = useExtendExpiration();

      const businessTypeId = businessTypes.find((type) => type.name === row.original.business_type)?._id;

      const handleExtendPlan = (planId: string) => {
        const selectedPlan = plans.find((plan) => plan._id === planId);
        if (!selectedPlan) {
          return;
        }
        extendExpiration({
          id: row.original.id,
          days: selectedPlan.period,
        });
      };
      return (
        <div className="flex gap-2">
          <ReadOnlyBusinessDialog data={row.original} isOpen={openViewDialog} onClose={setOpenViewDialog}>
            <Button variant="outline" size="sm">
              <Eye className="mr-1" />
              {t('module.common.view')}
            </Button>
          </ReadOnlyBusinessDialog>
          <EditBusinessDialog
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            initialData={{
              name_B: row.original.name,
              address_B: row.original.address,
              contact_B: row.original.contact,
              businessTaxCode: row.original.tax_code,
              businessType: businessTypeId || '',
            }}
            id={row.original.id as string}
          >
            <Button variant="outline" size="sm">
              <Edit className="mr-1" />
              {t('module.common.edit')}
            </Button>
          </EditBusinessDialog>
          <ExtendExpireDateDialog
            open={openExtendDialog}
            onOpenChange={setOpenExtendDialog}
            onSubmit={(values) => handleExtendPlan(values.plan)}
          >
            <Button variant="outline" size="sm">
              <ClockPlus className="mr-1" />
              {t('module.common.extend')}
            </Button>
          </ExtendExpireDateDialog>
          <CustomAlertDialog
            title={t('module.common.confirmAction')}
            description={t('module.common.confirmActionDescription', {
              status: row.original.available ? 'disabled' : 'enabled',
              name: row.original.name,
            })}
            onSubmit={() => toggleAvailableBusiness(row.original.id)}
            variant={row.original.available ? 'destructive' : 'default'}
            buttonSubmitLabel={row.original.available ? 'Disable' : 'Enable'}
          >
            {row.original.available ? (
              <Button variant="destructive" size="sm">
                <CircleX className="mr-1" />
                {t('module.common.disable')}
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <CircleCheck className="mr-1" />
                {t('module.common.enable')}
              </Button>
            )}
          </CustomAlertDialog>
        </div>
      );
    },
  },
];
