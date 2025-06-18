import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export type Menu = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  available: boolean;
  price: number;
};

export const columns: ColumnDef<Menu>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span className="font-medium">{value}</span>;
    },
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return value ? <img src={value} alt="Menu Item" className="w-16 h-16 object-cover rounded-md" /> : null;
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span className="text-sm text-muted-foreground">{value}</span>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'subcategory',
    header: 'Subcategory',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <span className="text-sm font-medium">${value.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions Buttons',
    cell: () => {
      const { t } = useTranslation();
      return (
        <div className="flex items-center gap-2">
          <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
            <Eye className="mr-2" />
            {t('module.qrManagement.table.actionButton.view')}
          </Button>
          <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
            <Edit className="mr-2" />
            {t('module.qrManagement.table.actionButton.edit')}
          </Button>
          <Button variant={'outline'} className="hover:bg-destructive hover:text-destructive-foreground">
            <Trash className="mr-2" />
            {t('module.qrManagement.table.actionButton.delete')}
          </Button>
        </div>
      ); // Placeholder for action buttons
    },
  },
];
