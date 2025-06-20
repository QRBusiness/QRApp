import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';

export type BusinessOwner = {
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

export const columns: ColumnDef<BusinessOwner>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue('name') || 'Unknown'}</p>;
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'phone',
    header: 'Contact Number',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'available',
    header: 'Available',
    cell: ({ row }) => {
      return (
        <Badge variant={row.getValue('available') ? 'outline' : 'destructive'}>
          {row.getValue('available') ? 'Yes' : 'No'}
        </Badge>
      );
    },
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
