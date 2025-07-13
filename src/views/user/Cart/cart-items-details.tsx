import React, { useEffect, useState } from 'react';
import { MENU_MANAGEMENT, OWNER_ROLE, STAFF_ROLE } from '@/constants';
import { useProcessRequest } from '@/services/owner/request-service';
import { useCreateOrderRequest } from '@/services/user/user-request-service';
import { Minus, Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { clearCart, removeFromCart, updateCartItemQuantity, useCartItems } from '@/components/common/states/cartState';
import { useGuestState } from '@/components/common/states/guestState';
import { useUserState } from '@/components/common/states/userState';
import { useViewState } from '@/components/common/states/viewState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CreateNewOrderRequest from '@/views/owner/menu-management/dialog/create-staff-order-dialog';
import { cn } from '@/libs/utils';

const CartItemsDetails: React.FC = () => {
  const { area, table } = useGuestState();
  const { items: cartItems } = useCartItems();
  const { isMobile } = useViewState();
  const { t } = useTranslation();
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { name } = useGuestState();
  const navigate = useNavigate();
  const user = useUserState();

  const [createOrderRequestDialog, setCreateOrderRequestDialog] = React.useState(false);

  const { createOrderRequest } = useCreateOrderRequest();
  const { processRequest } = useProcessRequest();

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTax = newSubtotal * 0; // 0% tax rate
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
      <Button onClick={() => window.history.back()}>{t('module.menuManagement.cart.continueShopping')}</Button>
    </div>
  );

  const onCheckout = async () => {
    debugger;
    if (user.role === STAFF_ROLE || user.role === OWNER_ROLE) {
      setCreateOrderRequestDialog(true);
    } else {
      await onGuestCheckout();
    }
  };
  const onGuestCheckout = async () => {
    await createOrderRequest({
      type: 'Order',
      reason: 'checkout',
      service_unit: table,
      area: area,
      guest_name: name,
      data: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        img_url: item.img_url || '', // Ensure img_url is included
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        options: item.options ? [...item.options] : [],
        note: item.note || '',
      })),
    });
    clearCart();
    navigate(`../${MENU_MANAGEMENT}?area=${area}&table=${table}`);
  };

  const onStaffCheckout = async ({
    area,
    service_unit,
    guest_name,
  }: {
    area: string;
    service_unit: string;
    guest_name: string;
  }) => {
    const response = await createOrderRequest({
      type: 'Order',
      reason: 'checkout',
      service_unit: service_unit,
      area: area,
      guest_name: guest_name,
      data: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        img_url: item.img_url || '', // Ensure img_url is included
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        options: item.options ? [...item.options] : [],
        note: item.note || '',
      })),
    });
    if (!response) return;
    await processRequest(response._id);
    clearCart();
    navigate(`../${MENU_MANAGEMENT}?area=${area}&table=${service_unit}`);
  };

  return (
    <div className="relative flex flex-col min-h-full p-4 border w-full max-w-5xl rounded-lg mx-auto">
      {(user.role === OWNER_ROLE || user.role === STAFF_ROLE) && (
        <CreateNewOrderRequest
          open={createOrderRequestDialog}
          onOpenChange={setCreateOrderRequestDialog}
          onSubmit={(data) => onStaffCheckout(data)}
        />
      )}

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
                      src={item.img_url!}
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
                        <span className="font-medium text-black">{item.variant}</span>
                      </div>
                      <div className="mt-1 mb-2">
                        <span className="text-black font-medium">
                          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                      </div>
                    </div>

                    {item.options && item.options.length > 0 && (
                      <div className="grid grid-col-1 md:grid-cols-2 gap-1 my-2">
                        {item.options.map((opt) => (
                          <Badge key={opt} variant="outline" className="text-xs text-muted-foreground col-span-1">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {item.note && <p className="text-xs text-muted-foreground mt-1 italic">"{item.note}"</p>}

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
                          {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
                <span className="text-muted-foreground">{t('module.menuManagement.cart.subtotal')}</span>
                <span className="font-medium">
                  {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('module.menuManagement.cart.tax', { taxRate: `${tax}` })}
                </span>
                <span className="font-medium">
                  {tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">{t('module.menuManagement.cart.total')}</span>
                <span className="text-muted-foreground font-semibold">
                  {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="col-span-2 md:col-span-1" onClick={() => window.history.back()}>
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
