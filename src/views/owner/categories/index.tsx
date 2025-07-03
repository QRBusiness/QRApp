import React from 'react';
import { useCategories, useCreateCategory } from '@/services/owner/categories-service';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import CreateNewCategory from './dialog/create-categories-dialog';
import type { CategogyProps } from './tables/columns';
import CategoryTable from './tables/page';

const CategoryPage = () => {
  const { t } = useTranslation();
  const [openCreateCategoryDialog, setOpenCreateCategoryDialog] = React.useState(false);
  const { createCategory } = useCreateCategory();
  const { categories } = useCategories();
  const [data, setData] = React.useState<CategogyProps[]>([]);

  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setData(
        categories.map((category) => ({
          _id: category._id,
          name: category.name,
          description: category.description,
          created_at: category.created_at,
          updated_at: category.updated_at,
        }))
      );
    }
  }, [categories]);
  return (
    <div className="container mx-auto pb-10 space-y-4">
      <div className="flex items-center justify-end">
        {/* Create Category Dialog */}
        <CreateNewCategory
          open={openCreateCategoryDialog}
          onOpenChange={setOpenCreateCategoryDialog}
          onSubmit={createCategory}
        >
          <Button variant="outline" className="rounded-full md:rounded w-9 h-9 md:w-auto">
            <Plus className="size-4 md:size-5" />
            <p className="text-sm hidden md:block"> {t('module.categoriesMgmt.button.add')}</p>
          </Button>
        </CreateNewCategory>
      </div>
      <CategoryTable data={data} />
    </div>
  );
};
export default CategoryPage;
