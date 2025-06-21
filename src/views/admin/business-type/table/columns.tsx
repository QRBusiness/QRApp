import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Copy, Edit, Eye, EyeOff, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Hint } from '@/components/common/hint';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';

export type BusinessType = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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
    accessorKey: 'id',
    header: 'Real ID',
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
              <EyeOff className="cursor-pointer" onClick={() => setIsHidden(false)} />
            ) : (
              <Eye className="cursor-pointer" onClick={() => setIsHidden(true)} />
            )}
          </Hint>
          <Hint label="Copy ID">
            <Copy className="cursor-pointer" onClick={() => copyHandler(id)} />
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
          <Button variant="destructive" size="sm">
            <Trash className="mr-2" />
            {t('module.common.delete')}
          </Button>
        </div>
      );
    },
  },
];
