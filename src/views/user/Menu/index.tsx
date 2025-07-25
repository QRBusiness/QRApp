import React, { useEffect } from 'react';
import { usePublicSubcategories } from '@/services/owner/categories-service';
import { usePublicProducts } from '@/services/owner/product-services';
import { useParams, useSearchParams } from 'react-router-dom';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import {
  useGuestState,
  useSetAreaAndTable,
  useSetBusiness,
  useSetGuestName,
} from '@/components/common/states/guestState';
import MenuCardItem from './components/MenuCartItem';
import UserInputModel from './components/UserInputModel';

const UserMenuPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const area = searchParams.get('area')!;
  const table = searchParams.get('table')!;
  const { name } = useGuestState();
  const [openUserInputModel, setOpenUserInputModel] = React.useState<boolean>(!name);

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
  const [currentFilterSubcategory, setCurrentFilterSubcategory] = React.useState<string>('all');
  const { products: items } = usePublicProducts({
    business: businessId!,
    category: '',
    sub_category: currentFilterSubcategory === 'all' ? '' : currentFilterSubcategory,
  });
  const { publicSubcategories } = usePublicSubcategories({ business: businessId! });

  let categoryOptions = publicSubcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  }));
  categoryOptions = [{ label: 'All', value: 'all' }, ...categoryOptions];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-4 px-2 w-full mx-auto pb-10">
      <UserInputModel
        open={openUserInputModel}
        onOpenChange={setOpenUserInputModel}
        onSubmit={(values) => useSetGuestName(values.name)}
      />
      <HorizontalFilterScroll
        className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 mb-4 w-full"
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
          image={item.img_url!}
          variants={item.variants}
          options={item.options}
          category={item.category}
          subcategory={item.subcategory}
          description={item.description}
          created_at={item.created_at}
          updated_at={item.updated_at}
        />
      ))}
    </div>
  );
};

export default UserMenuPage;
