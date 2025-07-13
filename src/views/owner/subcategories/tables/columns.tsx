import React from 'react';
import { useDeleteSubCategory, useUpdateSubCategory } from '@/services/owner/categories-service';
import { type Categories } from '@/services/owner/product-services';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { Button } from '@/components/ui/button';
import { formattedDate } from '@/libs/utils';
import CreateNewSubCategory from '../dialog/create-subsategories-dialog';
import ReadOnlyDialog from '../dialog/read-only-subcategory-dialog';

export type SubcategoryProps = {
  _id: string;
  name: string;
  description: string;
  category: Categories | null;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<SubcategoryProps>[] = [
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span className="text-sm text-muted-foreground">{value || 'No description'}</span>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as Categories;
      return <span className="text-sm font-medium">{category?.name || 'No mapping category'}</span>;
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
      const { updateSubCategory } = useUpdateSubCategory();
      const { deleteSubCategory } = useDeleteSubCategory();

      return (
        <div className="flex items-center gap-2">
          <ReadOnlyDialog isOpen={openViewDialog} onClose={setOpenViewDialog} data={row.original}>
            <Button
              variant={'outline'}
              className="hover:bg-primary hover:text-primary-foreground"
              onClick={() => setOpenViewDialog(true)}
            >
              <Eye className="mr-2" />
              {t('module.qrManagement.table.actionButton.view')}
            </Button>
          </ReadOnlyDialog>

          <CreateNewSubCategory
            open={openEditDialog}
            onOpenChange={setOpenEditDialog}
            create={false}
            initialData={{
              name: row.original.name,
              description: row.original.description,
              category: row.original.category?._id || '',
            }}
            onSubmit={(data) => updateSubCategory({ id: row.original._id, subCategory: data })}
          >
            <Button variant={'outline'} className="hover:bg-primary hover:text-primary-foreground">
              <Edit className="mr-2" />
              {t('module.qrManagement.table.actionButton.edit')}
            </Button>
          </CreateNewSubCategory>
          <CustomAlertDialog
            title={t('module.qrManagement.alertDialog.title')}
            description={t('module.qrManagement.alertDialog.description')}
            onSubmit={() => deleteSubCategory(row.original._id)}
          >
            <Button variant={'destructive'} className="hover:bg-destructive hover:text-destructive-foreground">
              <Trash className="mr-2" />
              {t('module.qrManagement.table.actionButton.delete')}
            </Button>
          </CustomAlertDialog>
        </div>
      ); // Placeholder for action buttons
    },
  },
];
