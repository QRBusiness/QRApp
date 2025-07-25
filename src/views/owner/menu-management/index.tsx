import React, { useState } from 'react';
import { useSubcategories } from '@/services/owner/categories-service';
import { useCreateProduct, useProducts } from '@/services/owner/product-services';
import { Laptop, Plus, Tablet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hint } from '@/components/common/hint';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import { toggleMenuDisplayOptionState, useMenuDisplayOptionState } from '@/components/common/states/menuStates';
import { useUserPermissions } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import { havePermissions } from '@/libs/utils';
import CreateNewMenuDialog from '../../user/Cart/create-new-menu-dialog';
import MobileMenuView from './mobile-card/mobile-view';
import type { Menu } from './tables/columns';
import MenuTable from './tables/page';

const MenuManagement = () => {
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const permissionCodes = permissions.map((permission) => permission.code);
  const { isTable: isTableView } = useMenuDisplayOptionState();

  const [openCreateNewMenuDialog, setOpenCreateNewMenuDialog] = useState(false);

  const { subcategories } = useSubcategories();

  let categoryOptions = subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  }));

  categoryOptions = [{ label: 'All', value: 'all' }, ...categoryOptions];
  const { createProduct } = useCreateProduct();
  const [currentFilterSubcategory, setCurrentFilterSubcategory] = React.useState<string>('all');

  const { products, refetch } = useProducts({
    category: '',
    sub_category: currentFilterSubcategory === 'all' ? '' : currentFilterSubcategory,
  });

  const productsTransformed: Menu[] = React.useMemo(() => {
    return products.map((product) => ({
      ...product,
      category: product.category, // keep as object of type Categories
      subcategory: product.subcategory, // keep as object of type Subcategories
      variants: product.variants.map((variant) => ({
        ...variant,
        type: variant.type,
      })),
      options: product.options.map((option) => ({
        ...option,
        type: option.type,
      })),
      image: product.img_url || '',
    }));
  }, [products]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [currentFilterSubcategory, refetch]);

  return (
    <div className="mx-auto pb-10 space-y-4 w-full">
      <div className="flex items-center space-x-2 justify-between mr-4 md:mr-0 w-full px-4 lg:px-0">
        {/* subcategory filter */}
        <HorizontalFilterScroll
          orderStatuses={categoryOptions.map((category) => ({
            label: category.label,
            value: category.value,
          }))}
          onChange={setCurrentFilterSubcategory}
        />
        <div className="flex items-center space-x-2">
          {/* Create new Menu Item Dialog */}
          {havePermissions(permissionCodes, ['create.product']) && (
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
                <p className="text-sm hidden md:block">{t('module.menuManagement.action.add')}</p>
              </Button>
            </CreateNewMenuDialog>
          )}
        </div>
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

      {isTableView ? <MenuTable data={productsTransformed} /> : <MobileMenuView items={productsTransformed} />}
    </div>
  );
};

export default MenuManagement;
