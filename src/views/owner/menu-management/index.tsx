import { useState } from 'react';
import React from 'react';
import { ADMIN_ROLE, OWNER_ROLE } from '@/constants';
import { useAddSubCategory, useCreateCategory } from '@/services/owner/categories-service';
import { useCreateProduct, useProducts } from '@/services/owner/product-services';
import { Laptop, Plus, Tablet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hint } from '@/components/common/hint';
import { toggleMenuDisplayOptionState, useMenuDisplayOptionState } from '@/components/common/states/menuStates';
import { useUserState } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import CreateNewCategory from '../categories/dialog/create-categories-dialog';
import CreateNewSubCategory from '../subcategories/dialog/create-subsategories-dialog';
import CreateNewMenuDialog from './dialog/create-new-menu-dialog';
import MobileMenuView from './mobile-card/mobile-view';
import type { Menu } from './tables/columns';
import MenuTable from './tables/page';

const MenuManagement = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Menu[]>([]);
  const user = useUserState();
  const { isTable: isTableView } = useMenuDisplayOptionState();
  const [openCreateNewMenuDialog, setOpenCreateNewMenuDialog] = useState(false);
  const [openCreateCategoryDialog, setOpenCreateCategoryDialog] = useState(false);
  const [openCreateSubCategoryDialog, setOpenCreateSubCategoryDialog] = useState(false);

  const { createCategory } = useCreateCategory();
  const { addSubCategory } = useAddSubCategory();
  const { createProduct } = useCreateProduct();

  const { products } = useProducts();

  React.useEffect(() => {
    if (products && products.length > 0) {
      setData(
        products.map((product) => ({
          _id: product._id,
          name: product.name,
          description: product.description,
          image:
            product.image_url ||
            'https://readdy.ai/api/search-image?query=Gourmet%20avocado%20toast%20with%20poached%20egg%20on%20sourdough%20bread%2C%20topped%20with%20cherry%20tomatoes%20and%20microgreens%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=1&orientation=squarish',
          category: product.category,
          subcategory: product.subcategory,
          variants: product.variants,
          options: product.options,
          created_at: product.created_at,
          updated_at: product.updated_at,
        }))
      );
    }
  }, [products]);

  const isShowAction = user?.role === OWNER_ROLE || user?.role === ADMIN_ROLE;

  return (
    <div className="container mx-auto pb-10 space-y-4">
      {isShowAction && (
        <div className="flex items-center space-x-2 justify-self-end mr-4 md:mr-0">
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
          {/* Create Subcategory Dialog */}
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
          {/* Create new Menu Item Dialog */}
          <CreateNewMenuDialog
            open={openCreateNewMenuDialog}
            onOpenChange={setOpenCreateNewMenuDialog}
            onSubmit={createProduct}
            onCancel={() => {
              // Handle cancel
            }}
          >
            <Button variant="default" className="rounded-full md:rounded w-9 h-9 md:w-auto">
              <Plus className="md:mr-2 h-4 w-4" />
              <p className="text-sm hidden md:block">Add New Menu Item</p>
            </Button>
          </CreateNewMenuDialog>

          {isTableView ? (
            <Hint label="Switch to Card View" align="end">
              <Button variant={'outline'} size={'icon'} onClick={() => toggleMenuDisplayOptionState()}>
                <Tablet className="size-5" strokeWidth={2.5} />
              </Button>
            </Hint>
          ) : (
            <Hint label="Switch to Table View">
              <Button variant={'secondary'} size={'icon'} onClick={() => toggleMenuDisplayOptionState()}>
                <Laptop className="size-5" strokeWidth={2.5} />
              </Button>
            </Hint>
          )}
        </div>
      )}
      {isTableView ? <MenuTable data={data} /> : <MobileMenuView items={data} />}
    </div>
  );
};

export default MenuManagement;
