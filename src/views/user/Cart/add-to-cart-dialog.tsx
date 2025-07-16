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
import { Textarea } from '@/components/ui/textarea';
import { CustomVariantsSelect } from '../../owner/menu-management/dialog/custom-variants-select';
import type { Menu } from '../../owner/menu-management/tables/columns';

export interface CartItemProps {
  _id: string;
  name: string;
  img_url: string; // Optional, can be used for product images
  quantity: number;
  price: number;
  variant: string;
  options: string[];
  note: string;
}

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  item: Menu;
  onSubmit: (item: CartItemProps) => void;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({ children, item, open, onOpenChange, onSubmit }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = React.useState('');
  const [isNotesChecked, setIsNotesChecked] = React.useState(false);

  const sizesOptions = item.variants.map((variant) => ({
    value: variant.type,
    label: `${variant.type} - ${variant.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
  }));
  const [selectedSize, setSelectedSize] = React.useState(sizesOptions[0]?.value || '');

  const menuOptions = item.options.map((option) => ({
    value: option.type,
    label: option.type + ' - ' + option.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
  }));

  const onAddToCart = () => {
    const variantIndex = item.variants.findIndex((variant) => variant.type === selectedSize);
    const totalPreferencesPrice = selectedPreferences.reduce((total, pref) => {
      const option = item.options.find((opt) => opt.type === pref);
      return total + (option?.price || 0);
    }, 0);

    const cartItem = {
      _id: item._id,
      name: item.name,
      img_url: item.image || '', // Ensure img_url is included
      quantity,
      variant: selectedSize,
      options: selectedPreferences,
      note: specialInstructions,
      price: item.variants[variantIndex]?.price + totalPreferencesPrice || 0,
    };
    onSubmit && onSubmit(cartItem);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        {/* Dialog Description */}
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2 capitalize">{item.name}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-sm text-muted-foreground">
                {item.description || 'No description available'}
              </DialogDescription>
              <div className="flex items-center space-x-2 text-sm">
                <p className="text-muted-foreground">{t('module.card.price')} :</p>
                <p className="text-xl font-semibold text-primary">
                  {(
                    item.variants[sizesOptions.findIndex((option) => option.value === selectedSize)]?.price +
                    selectedPreferences.reduce((total, pref) => {
                      const option = item.options.find((opt) => opt.type === pref);
                      return total + (option?.price || 0);
                    }, 0)
                  ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
              </div>
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-start justify-between gap-2 col-span-3 md:col-span-1">
              <Label>{t('module.menuManagement.addToCartDialog.quantity')}</Label>
              <div className="flex items-center gap-2 col-span-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full "
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full "
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            {/* Size */}
            <div className="flex flex-col items-start justify-center gap-2 col-span-3 md:col-span-1">
              <Label>{t('module.menuManagement.addToCartDialog.sizes')}</Label>
              <CustomVariantsSelect
                options={sizesOptions}
                value={selectedSize}
                onChange={setSelectedSize}
                selectLabel="Sizes"
              />
            </div>
          </div>
          {/* Options */}
          <div className="space-y-2">
            <Label>{t('module.menuManagement.addToCartDialog.additionalToppings')}</Label>
            <div className="space-y-2">
              {menuOptions.map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${item._id}-${option.value}`}
                    checked={selectedPreferences.includes(option.value)}
                    onCheckedChange={(checked: any) => {
                      if (checked) {
                        setSelectedPreferences([...selectedPreferences, option.value]);
                      } else {
                        setSelectedPreferences(selectedPreferences.filter((p) => p !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={`${item._id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="special-instructions"
                  checked={!!isNotesChecked}
                  onCheckedChange={(checked: any) => {
                    setIsNotesChecked(checked);
                  }}
                />
                <Label>{t('module.menuManagement.addToCartDialog.notes')}</Label>
              </div>
              {isNotesChecked && (
                <Textarea
                  className="w-full p-2 border rounded-md h-20 resize-none"
                  placeholder={t('module.menuManagement.addToCartDialog.notesPlaceholder')}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 justify-between items-center">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            <CircleX className="size-5 mr-2" />
            {t('module.menuManagement.addToCartDialog.cancel')}
          </Button>
          <Button onClick={onAddToCart} className="flex-1">
            <CirclePlus className="size-5 mr-2" />
            {t('module.menuManagement.addToCartDialog.addToCart')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
