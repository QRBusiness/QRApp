import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hint } from '@/components/common/hint';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import { Button } from '@/components/ui/button';
import type { Menu } from '../table/columns';
import MenuCardItem from './mobile-card-item';

interface MobileMenuViewProps {
  items: Menu[];
}

const MobileMenuView: React.FC<MobileMenuViewProps> = ({ items }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState<Menu[]>([]);
  const subCategories = ['All', ...Array.from(new Set(items.map((item) => item.subcategory)))];
  const addToCartHandler = (id: string | number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setCartItems((prev) => [...prev, item]);
    }
  };
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      <HorizontalFilterScroll
        className="col-span-1 md:col-span-2 lg:col-span-4 mb-4"
        orderStatuses={subCategories.map((subcategory) => ({
          id: subcategory,
          name: subcategory,
          value: subcategory,
        }))}
      />
      {items.map((item) => (
        <MenuCardItem
          key={item.id}
          id={item.id}
          image={item.image}
          name={item.name}
          category={item.category}
          subcategory={item.subcategory}
          price={item.price}
          available={item.available}
          description={item.description}
          onAddToCart={addToCartHandler}
        />
      ))}
      <Hint label="View Cart Items" align="end">
        <Button
          variant="default"
          className="fixed bottom-17 md:bottom-4 right-4 flex items-center p-2 w-12 h-12 rounded-md cursor-pointer"
          onClick={() => navigate('cart')}
        >
          <div className="relative w-full h-full  flex items-center justify-center">
            <ShoppingCart className="size-6" />
            <p className="absolute text-xs md:text-sm font-medium -top-4 -right-4 p-1 border bg-white border-primary text-black h-5 w-5 rounded-full flex items-center justify-center">
              {cartItems.length}
            </p>
          </div>
        </Button>
      </Hint>
    </div>
  );
};

export default MobileMenuView;
