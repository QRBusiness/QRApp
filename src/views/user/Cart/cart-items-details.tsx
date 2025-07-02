import React, { useEffect, useState } from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { removeFromCart, updateCartItemQuantity, useCartItems } from '@/components/common/states/cartState';
import { useViewState } from '@/components/common/states/viewState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/libs/utils';

const CartItemsDetails: React.FC = () => {
  const { items: cartItems } = useCartItems();

  const { isMobile } = useViewState();
  const { t } = useTranslation();
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTax = newSubtotal * 0.0825; // 8.25% tax rate
    const newTotal = newSubtotal + newTax;
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    updateCartItemQuantity(id, newQuantity);
  };
  // Here you would typically update the cart state with the new items

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const EmptyCartView = () => (
    <div className="flex flex-col items-center justify-center h-[500px] px-6">
      <h3 className="text-xl font-semibold text-primary mb-2">{t('module.menuManagement.cart.emptyCart')}</h3>
      <p className="text-muted-foreground text-sm text-center mb-8">
        {t('module.menuManagement.cart.emptyCartDescription')}
      </p>
      <Button>{t('module.menuManagement.cart.continueShopping')}</Button>
    </div>
  );

  const onCheckout = () => {
    // Handle checkout logic here
    console.log('Proceeding to checkout with total:', cartItems);
  };

  return (
    <div className="relative flex flex-col min-h-screen p-4 border w-full max-w-5xl rounded-lg mx-auto">
      {/* Main Content */}
      <ScrollArea className="flex-1">
        {cartItems.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className={cn('space-y-4', isMobile ? 'mb-68' : 'mb-48')}>
            {cartItems.map((item) => (
              <Card key={item._id} className="p-4 border shadow-sm">
                <div className="gap-3 flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={
                        'https://readdy.ai/api/search-image?query=Gourmet%20avocado%20toast%20with%20poached%20egg%20on%20sourdough%20bread%2C%20topped%20with%20cherry%20tomatoes%20and%20microgreens%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=1&orientation=squarish'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start space-x-2">
                      <h3 className="font-medium text-black">{item.name}</h3>
                      <CustomAlertDialog
                        title={t('module.menuManagement.cart.removeItemTitle')}
                        description={t('module.menuManagement.cart.removeItemDescription')}
                        onSubmit={() => item._id && removeItem(item._id)}
                        buttonSubmitLabel={t('module.menuManagement.cart.remove')}
                      >
                        <Button variant="destructive" size="icon" className="group">
                          <Trash className="size-5 group-hover:rotate-15 transition-transform duration-300 ease-in-out" />
                        </Button>
                      </CustomAlertDialog>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('module.menuManagement.cart.size')}:{' '}
                        <span className="font-medium text-black">{item.selectedSize}</span>
                      </div>
                      <div className="mt-1 mb-2">
                        <span className="text-black font-medium">{item.price.toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>

                    {item.selectedPreferences && item.selectedPreferences.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {item.selectedPreferences.map((pref) => (
                          <Badge key={pref} variant="outline" className="text-xs text-muted-foreground">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{item.specialInstructions}"</p>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="rounded-full"
                        >
                          <Minus />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="rounded-full"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <div className="text-right text-primary">
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString('vi-VN') + ' VND'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Price Summary and Action Buttons */}
      {cartItems.length > 0 && (
        <div
          className={cn(
            'fixed md:absolute bottom-0 left-0 right-0 w-full border-t shadow-lg bg-background ',
            isMobile && 'pb-14'
          )}
        >
          <div className="px-4 py-3">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('module.menuManagement.cart.subtotal')}</span>
                <span className="font-medium">{subtotal.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('module.menuManagement.cart.tax', { taxRate: '8.25' })}</span>
                <span className="font-medium">{tax.toLocaleString('vi-VN')} VND</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-800 font-semibold">{t('module.menuManagement.cart.total')}</span>
                <span className="text-gray-800 font-semibold">{total.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="col-span-2 md:col-span-1">
                {t('module.menuManagement.cart.continueShopping')}
              </Button>

              <Button variant="default" className="col-span-2 md:col-span-1" onClick={onCheckout}>
                {t('module.menuManagement.cart.checkout', { total: total.toFixed(2) })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemsDetails;
