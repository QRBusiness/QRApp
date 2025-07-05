import React from 'react';
import { useAddSubCategory, useSubcategories } from '@/services/owner/categories-service';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import CreateNewSubCategory from './dialog/create-subsategories-dialog';
import type { SubcategoryProps } from './tables/columns';
import SubcategoryTable from './tables/page';

const SubcategoryPage = () => {
  const { t } = useTranslation();
  const { subcategories } = useSubcategories();
  const [data, setData] = React.useState<SubcategoryProps[]>([]);
  const [openCreateSubCategoryDialog, setOpenCreateSubCategoryDialog] = React.useState(false);

  React.useEffect(() => {
    if (subcategories && subcategories.length > 0) {
      setData(
        subcategories.map((subcategory) => ({
          _id: subcategory._id,
          name: subcategory.name,
          description: subcategory.description,
          created_at: subcategory.created_at,
          updated_at: subcategory.updated_at,
        }))
      );
    }
  }, [subcategories]);

  const { addSubCategory } = useAddSubCategory();

  return (
    <div className="w-full mx-auto pb-10 space-y-4">
      <div className="flex items-center justify-end">
        <CreateNewSubCategory
          open={openCreateSubCategoryDialog}
          onOpenChange={setOpenCreateSubCategoryDialog}
          onSubmit={addSubCategory}
        >
          <Button variant="outline" className="rounded-full md:rounded w-9 h-9 md:w-auto">
            <Plus className="size-4 md:size-5" />
            <p className="text-sm hidden md:block">{t('module.categoriesMgmt.subCategories.button.add')}</p>
          </Button>
        </CreateNewSubCategory>
      </div>
      <SubcategoryTable data={data} />
    </div>
  );
};
export default SubcategoryPage;
