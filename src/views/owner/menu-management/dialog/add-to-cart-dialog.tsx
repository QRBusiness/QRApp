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
import type { Menu } from '../tables/columns';
import { CustomVariantsSelect } from './custom-variants-select';

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  item: Menu;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({ children, item, open, onOpenChange }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedPreferences, setSelectedPreferences] = React.useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = React.useState('');

  const sizesOptions = item.variants.map((variant) => ({
    value: variant.type,
    label: `${variant.type} - ${variant.price.toLocaleString('vn-VN')} VND`,
  }));

  const [selectedSize, setSelectedSize] = React.useState(sizesOptions[0]?.value || '');

  const onSubmit = () => {};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                {(item.variants[0]?.price * quantity).toLocaleString('vn-VN') + ' VND'}
              </p>
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="flex flex-col md:flex-row md:w-full md:items-center items-start md:justify-start gap-4">
            <div className="flex flex-col items-center gap-2">
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
            <div className="flex flex-col items-start justify-center gap-2">
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
              {[
                { label: 'Cheese', price: 5 },
                { label: 'Bacon', price: 6 },
                { label: 'Mushrooms', price: 4 },
                { label: 'Peppers', price: 3 },
              ].map((topping) => (
                <div key={topping.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${item._id}-${topping.label}`}
                    checked={selectedPreferences.includes(topping.label)}
                    onCheckedChange={(checked: any) => {
                      if (checked) {
                        setSelectedPreferences([...selectedPreferences, topping.label]);
                      } else {
                        setSelectedPreferences(selectedPreferences.filter((p) => p !== topping.label));
                      }
                    }}
                  />
                  <Label htmlFor={`${item._id}-${topping.label}`}>
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
          <Button variant="outline">
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
