import React from 'react';
import {
  type Categories,
  type OptionsProps,
  type Subcategories,
  type VariantProps,
  useDeleteProduct,
  useUpdateProduct,
} from '@/services/owner/product-services';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type z from 'zod';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Button } from '@/components/ui/button';
import type { createProductSchema } from '@/utils/schemas';
import { formattedDate } from '@/libs/utils';
import CreateNewMenuDialog from '../../../user/Cart/create-new-menu-dialog';
import ReadOnlyMenuItemDialog from '../dialog/read-only-menu-item-dialog';

export type Menu = {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: Categories;
  subcategory: Subcategories;
  variants: VariantProps[];
  options: OptionsProps[];
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Menu>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <span className="text-sm font-medium">{index}</span>;
    },
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
    cell: ({ row }) => {
      const category = row.getValue('category') as Categories;
      return <span className="text-sm font-medium">{category.name || 'Category'}</span>;
    },
  },
  {
    accessorKey: 'subcategory',
    header: 'Subcategory',
    cell: ({ row }) => {
      const subcategory = row.getValue('subcategory') as Subcategories;
      return <span className="text-sm font-medium">{subcategory.name || 'Subcategory'}</span>;
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
    header: 'Actions Buttons',
    cell: ({ row }) => {
      const { t } = useTranslation();
      const [openViewDialog, setOpenViewDialog] = React.useState(false);
      const [openEditDialog, setOpenEditDialog] = React.useState(false);

      const { updateProduct } = useUpdateProduct();
      const { deleteProduct } = useDeleteProduct();

      const handleEditSubmit = async (values: z.infer<typeof createProductSchema>) => {
        await updateProduct({ id: row.original._id, data: values });
        setOpenEditDialog(false);
      };

      return (
        <div className="flex items-center gap-2">
          <ReadOnlyMenuItemDialog isOpen={openViewDialog} onClose={setOpenViewDialog} data={row.original}>
            <Button
              variant={'outline'}
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => setOpenViewDialog(true)}
            >
              <Eye className="mr-2" />
              {t('module.qrManagement.table.actionButton.view')}
            </Button>
          </ReadOnlyMenuItemDialog>
          <CreateNewMenuDialog
            isCreate={false}
            initialValues={{
              name: row.original.name,
              description: row.original.description,
              category: row.original.category._id,
              sub_category: row.original.subcategory._id,
              variants: row.original.variants,
              options: row.original.options,
            }}
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            onSubmit={handleEditSubmit}
          >
            <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
              <Edit className="mr-2" />
              {t('module.qrManagement.table.actionButton.edit')}
            </Button>
          </CreateNewMenuDialog>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deleteProduct(row.original._id)}
          >
            <Button variant={'outline'} className="hover:bg-destructive hover:text-destructive-foreground">
              <Trash className="mr-2" />
              {t('module.qrManagement.table.actionButton.delete')}
            </Button>
          </CustomAlertDialog>
        </div>
      ); // Placeholder for action buttons
    },
  },
];
