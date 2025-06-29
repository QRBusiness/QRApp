import React from 'react';
import { CirclePlus, CircleX, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { MenuItem } from '../mobile-card/mobile-card-item';

interface AddToCartDialogProps {
  children: React.ReactNode;
  item: MenuItem;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({ children, item }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = React.useState('');
  const sizes = [
    {
      id: 'size-small',
      label: 'Size S',
      value: 'small',
      price: 0, // Optional price for size
    },
    {
      id: 'size-medium',
      label: 'Size M',
      value: 'medium',
      price: 5, // Optional price for size
    },
    {
      id: 'size-large',
      label: 'Size L',
      value: 'large',
      price: 10, // Optional price for size
    },
  ];
  const [selectedSize, setSelectedSize] = React.useState(sizes[0].value);

  const onSubmit = () => {
    const selectedItem = {
      ...item,
      quantity,
      size: selectedSize,
      preferences: selectedPreferences,
      specialInstructions,
    };
    if (item.onAddToCart) {
      console.log('Adding to cart:', selectedItem);
      item.onAddToCart(item.id);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{item.name}</DialogTitle>
        </DialogHeader>
        {/* Dialog Description */}
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <DialogDescription className="text-sm text-muted-foreground">{item.description}</DialogDescription>
              <p className="text-lg font-semibold text-primary mt-2">
                ${(item.variants[0]?.price * quantity).toFixed(2)}
              </p>
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="flex flex-col md:flex-row md:w-full md:items-center items-start md:justify-start gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label>{t('module.menuManagement.addToCartDialog.quantity')}</Label>
              <div className="flex items-center gap-2 col-span-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full "
                >
                  <Minus className="size-5" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full "
                >
                  <Plus className="size-5" />
                </Button>
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-4 items-start gap-2">
              <Label>{t('module.menuManagement.addToCartDialog.sizes')}</Label>
              <RadioGroup
                defaultValue={sizes[0].value}
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="col-span-3 md:flex md:items-center md:space-x-4 space-y-2 md:space-y-0"
              >
                {sizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.value} id={size.id} />
                    <Label htmlFor={size.id}>
                      {size.label} - ${size.price}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          {/* Options */}
          <div className="space-y-2">
            <Label>{t('module.menuManagement.addToCartDialog.additionalToppings')}</Label>
            <div className="space-y-2">
              {[
                { label: 'Cheese', price: 5 },
                { label: 'Bacon', price: 6 },
                { label: 'Mushrooms', price: 4 },
                { label: 'Peppers', price: 3 },
              ].map((topping) => (
                <div key={topping.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${item.id}-${topping.label}`}
                    checked={selectedPreferences.includes(topping.label)}
                    onCheckedChange={(checked: any) => {
                      if (checked) {
                        setSelectedPreferences([...selectedPreferences, topping.label]);
                      } else {
                        setSelectedPreferences(selectedPreferences.filter((p) => p !== topping.label));
                      }
                    }}
                  />
                  <Label htmlFor={`${item.id}-${topping.label}`}>
                    {topping.label} - ${topping.price}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('module.menuManagement.addToCartDialog.notes')}</Label>
            <Textarea
              className="w-full p-2 border rounded-md h-20 resize-none"
              placeholder={t('module.menuManagement.addToCartDialog.notesPlaceholder')}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <CircleX className="size-5 mr-2" />
            {t('module.menuManagement.addToCartDialog.cancel')}
          </Button>
          <Button onClick={onSubmit}>
            <CirclePlus className="size-5 mr-2" />
            {t('module.menuManagement.addToCartDialog.addToCart')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
