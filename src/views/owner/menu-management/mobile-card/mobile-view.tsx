import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hint } from '@/components/common/hint';
import { useCartTotalQuantity } from '@/components/common/states/cartState';
import { Button } from '@/components/ui/button';
import type { Menu } from '../tables/columns';
import MenuCardItem from './mobile-card-item';

interface MobileMenuViewProps {
  items: Menu[];
}

const MobileMenuView: React.FC<MobileMenuViewProps> = ({ items }) => {
  const navigate = useNavigate();
  const { totalQuantity } = useCartTotalQuantity();
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 w-full">
      {items.map((item) => (
        <MenuCardItem
          key={item._id}
          _id={item._id}
          image={item.image}
          name={item.name}
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

export default MobileMenuView;
