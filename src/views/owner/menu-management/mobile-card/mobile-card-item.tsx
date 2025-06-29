import type { OptionsProps } from '@/services/owner/product-services';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AddToCartDialog from '../dialog/add-to-cart-dialog';

export interface MenuItem {
  id: string | number;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  options: OptionsProps[];
  variants: OptionsProps[];
  description: string; // Optional description for the menu item
  onAddToCart?: (id: string | number) => void; // Callback for adding to cart
  onRemoveFromCart?: (id: string | number) => void; // Callback for removing from cart
}

const MenuCardItem: React.FC<MenuItem> = ({
  id,
  image,
  name,
  category,
  subcategory,
  description,
  variants = [],
  options = [],
  onAddToCart = () => {},
  onRemoveFromCart = () => {},
}) => {
  const price = variants[0]?.price || 0; // Placeholder for price, can be replaced with actual price logic
  const available = true; // Placeholder for availability, can be replaced with actual availability logic
  return (
    <Card className="flex overflow-hidden border shadow-sm p-2 relative" key={id}>
      <div className="flex flex-row gap-2 items-start">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-md">
          <img src={image} alt={name} className="object-cover w-full h-full object-top rounded-md" />
        </div>
        <div className="flex justify-between items-start flex-1">
          <div className="flex flex-col pr-2">
            <h3 className="font-semibold text-black text-base mb-1">{name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{description}</p>
            <div className="flex flex-row items-center justify-start gap-1">
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                {category}
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                {subcategory}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between ml-1">
            <span className="font-medium text-primary">{price.toLocaleString('vi-VN')}</span>
          </div>
          <AddToCartDialog
            item={{
              id,
              name,
              category,
              variants,
              options,
              subcategory,
              image,
              description,
              onAddToCart,
              onRemoveFromCart,
            }}
          >
            <Button
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full  cursor-pointer"
              disabled={!available}
            >
              <Plus className="size-5" />
            </Button>
          </AddToCartDialog>
        </div>
      </div>
    </Card>
  );
};

export default MenuCardItem;
