import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';

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
