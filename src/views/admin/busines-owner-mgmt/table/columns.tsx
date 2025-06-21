import type { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, CircleX, Edit, Eye, Trash } from 'lucide-react';
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
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.index + 1}</span>;
    },
    // enableSorting: false,
    // enableHiding: false,
    // enableColumnFilter: false,
    // enableResizing: false,
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
    cell: ({ row }) => {
      return <span className="text-base font-medium text-foreground">{row.getValue('username') || 'No Username'}</span>;
    },
  },
  {
    accessorKey: 'available',
    header: 'Available',
    cell: ({ row }) => (
      <Badge variant="outline" className="text-foreground px-2 py-1 text-sm">
        {row.original.available === true ? (
          <CircleCheck className="fill-status-active " />
        ) : (
          <CircleX className="fill-status-inactive " />
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
