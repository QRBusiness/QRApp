import React from 'react';
import { Plus, ScanText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReadOnlyMenuItemDialog from '@/views/owner/menu-management/dialog/read-only-menu-item-dialog';
import type { Menu } from '@/views/owner/menu-management/tables/columns';
import AddToCartDialog from '@/views/user/Cart/add-to-cart-dialog';

const MenuCardItem: React.FC<Menu> = ({
  _id,
  image,
  name,
  category,
  subcategory,
  description,
  variants = [],
  options = [],
  created_at,
  updated_at,
}) => {
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [addToCartDialogOpen, setAddToCartDialogOpen] = React.useState(false);

  const price = variants[0]?.price || 0; // Placeholder for price, can be replaced with actual price logic
  const available = true; // Placeholder for availability, can be replaced with actual availability logic
  return (
    <Card key={_id} className="flex overflow-hidden border shadow-sm p-2 relative flex-col justify-between w-full">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-start flex-1 whitespace-break-spaces">
          <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 overflow-hidden rounded-md">
            <img src={image} alt={name} className="object-cover w-full h-full object-top rounded-md" />
          </div>
          <div className="flex justify-between flex-1 items-start break-words">
            <div className="flex flex-col pr-2">
              <h3 className="font-semibold text-black text-base mb-1">{name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2items-center justify-start gap-1">
                <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                  {category.name}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                  {subcategory.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="self-start min-w-fit flex-none">
          <span className="font-medium text-primary whitespace-nowrap">
            {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        </div>
      </div>
      <div className="flex items-center self-end space-x-2">
        <ReadOnlyMenuItemDialog
          isOpen={viewDialogOpen}
          onClose={setViewDialogOpen}
          data={{
            _id,
            name,
            category,
            subcategory,
            image,
            options,
            variants,
            description,
            created_at,
            updated_at,
          }}
        >
          <Button size="icon" className="rounded-full" disabled={!available} variant={'outline'}>
            <ScanText className="size-4 md:size-5" />
          </Button>
        </ReadOnlyMenuItemDialog>
        <AddToCartDialog
          open={addToCartDialogOpen}
          onOpenChange={setAddToCartDialogOpen}
          item={{
            _id,
            name,
            category,
            subcategory,
            image,
            options,
            variants,
            description,
            created_at,
            updated_at,
          }}
        >
          <Button size="icon" className="rounded-full" disabled={!available} variant={'default'}>
            <Plus className="size-4 md:size-5" />
          </Button>
        </AddToCartDialog>
      </div>
    </Card>
  );
};

export default MenuCardItem;
