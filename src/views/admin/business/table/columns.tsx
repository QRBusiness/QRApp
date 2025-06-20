import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';

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
};

export const columns: ColumnDef<BusinessType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Business Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
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
    cell: ({ row }) => {
      return (
        <Badge variant={row.getValue('available') ? 'outline' : 'destructive'}>
          {row.getValue('available') ? 'Yes' : 'No'}{' '}
        </Badge>
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
    cell: () => {
      const { t } = useTranslation();
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2" />
            {t('module.common.view')}
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2" />
            {t('module.common.edit')}
          </Button>
          <Button variant="outline" size="sm">
            <Trash className="mr-2" />
            {t('module.common.delete')}
          </Button>
        </div>
      );
    },
  },
];
