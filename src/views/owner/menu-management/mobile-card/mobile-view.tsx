import React from 'react';
import { useSubcategories } from '@/services/owner/categories-service';
import HorizontalFilterScroll from '@/components/common/horizontal-filter-scroll';
import type { Menu } from '../tables/columns';
import MenuCardItem from './mobile-card-item';

interface MobileMenuViewProps {
  items: Menu[];
}

const MobileMenuView: React.FC<MobileMenuViewProps> = ({ items }) => {
  const { subcategories } = useSubcategories();
  const [currentFilterSubcategory, setCurrentFilterSubcategory] = React.useState<string>('all');

  let categoryOptions = subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory._id,
  }));
  categoryOptions = [{ label: 'All', value: 'all' }, ...categoryOptions];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 w-full">
      <HorizontalFilterScroll
        className="col-span-1 md:col-span-2 xl:col-span-3 2xl:col-span-4 mb-4"
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
