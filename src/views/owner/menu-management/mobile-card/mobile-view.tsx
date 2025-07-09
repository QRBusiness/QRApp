import React from 'react';
import type { Menu } from '../tables/columns';
import MenuCardItem from './mobile-card-item';

interface MobileMenuViewProps {
  items: Menu[];
}

const MobileMenuView: React.FC<MobileMenuViewProps> = ({ items }) => {
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
    </div>
  );
};

export default MobileMenuView;
