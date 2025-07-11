import React, { useEffect } from 'react';
import { useSubcategories } from '@/services/owner/categories-service';
import { usePublicProducts } from '@/services/owner/product-services';
import { Bell, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Hint } from '@/components/common/hint';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import { useCartTotalQuantity } from '@/components/common/states/cartState';
import {
  useGuestState,
  useSetAreaAndTable,
  useSetBusiness,
  useSetGuestName,
} from '@/components/common/states/guestState';
import { Button } from '@/components/ui/button';
import MenuCardItem from './components/MenuCartItem';
import UserInputModel from './components/UserInputModel';
import CreateRequestDialog from './components/dialog/create-request-dialog';

const UserMenuPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const area = searchParams.get('area')!;
  const table = searchParams.get('table')!;
  const { name } = useGuestState();
  const [openUserInputModel, setOpenUserInputModel] = React.useState<boolean>(!name);
  const [openCreateRequestDialog, setOpenCreateRequestDialog] = React.useState<boolean>(false);
  useEffect(() => {
    // If the guest name is not set, open the user input model
    useSetBusiness(businessId!);
  }, [businessId]);
  useEffect(() => {
    // Set the guest state with area and table from search params
    if (area && table) {
      useSetAreaAndTable({
        area: area,
        table: table,
      });
    }
  }, [area, table]);

  const navigate = useNavigate();
  const { totalQuantity } = useCartTotalQuantity();
  const [currentFilterSubcategory, setCurrentFilterSubcategory] = React.useState<string>('all');
  const { products: items } = usePublicProducts({
    business: businessId!,
    category: '',
    sub_category: currentFilterSubcategory === 'all' ? '' : currentFilterSubcategory,
  });
  const { subcategories } = useSubcategories();

  let categoryOptions = subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  }));
  categoryOptions = [{ label: 'All', value: 'all' }, ...categoryOptions];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 w-full mx-auto">
      <UserInputModel
        open={openUserInputModel}
        onOpenChange={setOpenUserInputModel}
        onSubmit={(values) => useSetGuestName(values.name)}
      />
      <HorizontalFilterScroll
        className="col-span-1 md:col-span-2 lg:col-span-4 mb-4 w-full"
        orderStatuses={categoryOptions.map((category) => ({
          label: category.label,
          value: category.value,
        }))}
        onChange={setCurrentFilterSubcategory}
      />
      {items.map((item) => (
        <MenuCardItem
          key={item._id}
          _id={item._id}
          name={item.name}
          image="https://readdy.ai/api/search-image?query=Gourmet%20avocado%20toast%20with%20poached%20egg%20on%20sourdough%20bread%2C%20topped%20with%20cherry%20tomatoes%20and%20microgreens%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=1&orientation=squarish"
          variants={item.variants}
          options={item.options}
          category={item.category}
          subcategory={item.subcategory}
          description={item.description}
          created_at={item.created_at}
          updated_at={item.updated_at}
        />
      ))}
      <div className="fixed bottom-17 md:bottom-4 right-4 flex flex-col gap-3 z-50">
        <CreateRequestDialog open={openCreateRequestDialog} onOpenChange={setOpenCreateRequestDialog}>
          <Hint label="View Cart Items" align="end">
            <Button
              variant="default"
              className="flex items-center p-2 w-12 h-12 rounded-md cursor-pointer"
              onClick={() => setOpenCreateRequestDialog(true)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Bell className="size-6" />
              </div>
            </Button>
          </Hint>
        </CreateRequestDialog>
        <Hint label="View Cart Items" align="end">
          <Button
            variant="default"
            className="flex items-center p-2 w-12 h-12 rounded-md cursor-pointer"
            onClick={() => navigate('../cart')}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <ShoppingCart className="size-6" />
              <p className="absolute text-xs md:text-sm font-medium -top-4 -right-4 p-1 border bg-white border-primary text-black h-5 w-5 rounded-full flex items-center justify-center">
                {totalQuantity > 10 ? '10+' : totalQuantity}
              </p>
            </div>
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default UserMenuPage;
