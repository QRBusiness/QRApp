import React from 'react';
import { useSubcategories } from '@/services/owner/categories-service';
import { useProducts } from '@/services/owner/product-services';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hint } from '@/components/common/hint';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import { Button } from '@/components/ui/button';
import MenuCardItem from './components/MenuCartItem';

const UserMenuPage: React.FC = () => {
  const navigate = useNavigate();

  const { products: items } = useProducts();
  const { subcategories } = useSubcategories();
  const [currentFilterSubcategory, setCurrentFilterSubcategory] = React.useState<string>('all');

  let categoryOptions = subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  }));
  categoryOptions = [{ label: 'All', value: 'all' }, ...categoryOptions];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      <HorizontalFilterScroll
        className="col-span-1 md:col-span-2 lg:col-span-4 mb-4"
        orderStatuses={categoryOptions.map((category) => ({
          label: category.label,
          value: category.value,
        }))}
        onChange={setCurrentFilterSubcategory}
      />
      {items
        .filter((item) => currentFilterSubcategory === 'all' || item.subcategory._id === currentFilterSubcategory)
        .map((item) => (
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
      <Hint label="View Cart Items" align="end">
        <Button
          variant="default"
          className="fixed bottom-17 md:bottom-4 right-4 flex items-center p-2 w-12 h-12 rounded-md cursor-pointer"
          onClick={() => navigate('../cart')}
        >
          <div className="relative w-full h-full  flex items-center justify-center">
            <ShoppingCart className="size-6" />
            <p className="absolute text-xs md:text-sm font-medium -top-4 -right-4 p-1 border bg-white border-primary text-black h-5 w-5 rounded-full flex items-center justify-center">
              {4}
            </p>
          </div>
        </Button>
      </Hint>
    </div>
  );
};

export default UserMenuPage;
