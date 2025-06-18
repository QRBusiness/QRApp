import React, { useEffect, useState } from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomAlertDialog from '@/components/common/dialog/custom-alert-dialog';
import { useViewState } from '@/components/common/states/viewState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/libs/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: 'S' | 'M' | 'L'; // Assuming size is one of these values
  options?: string[];
  notes?: string;
}

const CartItemsDetails: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Avocado Toast with Poached Egg',
      price: 12.99,
      image:
        'https://readdy.ai/api/search-image?query=Gourmet%2520avocado%2520toast%2520with%2520poached%2520egg%2520on%2520sourdough%2520bread%252C%2520topped%2520with%2520cherry%2520tomatoes%2520and%2520microgreens%252C%2520professional%2520food%2520photography%252C%2520bright%2520natural%2520lighting%252C%2520shallow%2520depth%2520of%2520field%252C%2520appetizing%2520presentation%252C%2520isolated%2520on%2520light%2520neutral%2520background%252C%2520high%2520resolution&width=400&height=400&seq=1&orientation=squarish',
      quantity: 1,
      options: ['No Onions'],
      size: 'M',
    },
    {
      id: '3',
      name: 'Grilled Salmon Bowl',
      price: 22.99,
      image:
        'https://readdy.ai/api/search-image?query=Grilled%2520salmon%2520fillet%2520with%2520quinoa%252C%2520roasted%2520vegetables%2520and%2520avocado%2520in%2520a%2520bowl%2520with%2520lemon-dill%2520sauce%252C%2520professional%2520food%2520photography%252C%2520bright%2520natural%2520lighting%252C%2520appetizing%2520presentation%252C%2520isolated%2520on%2520light%2520neutral%2520background%252C%2520high%2520resolution&width=400&height=400&seq=3&orientation=squarish',
      quantity: 2,
      size: 'L',
      notes: 'More lemon please',
    },
    {
      id: '4',
      name: 'Grilled Salmon Bowl',
      price: 22.99,
      image:
        'https://readdy.ai/api/search-image?query=Grilled%2520salmon%2520fillet%2520with%2520quinoa%252C%2520roasted%2520vegetables%2520and%2520avocado%2520in%2520a%2520bowl%2520with%2520lemon-dill%2520sauce%252C%2520professional%2520food%2520photography%252C%2520bright%2520natural%2520lighting%252C%2520appetizing%2520presentation%252C%2520isolated%2520on%2520light%2520neutral%2520background%252C%2520high%2520resolution&width=400&height=400&seq=3&orientation=squarish',
      quantity: 2,
      options: ['Extra Spicy', 'No Onions'],
      size: 'L',
      notes: 'Please make it extra spicy',
    },
    {
      id: '6',
      name: 'Wagyu Beef Burger',
      price: 26.99,
      image:
        'https://readdy.ai/api/search-image?query=Gourmet%2520Wagyu%2520beef%2520burger%2520with%2520caramelized%2520onions%252C%2520melted%2520aged%2520cheddar%2520cheese%252C%2520and%2520truffle%2520aioli%2520on%2520a%2520brioche%2520bun%252C%2520professional%2520food%2520photography%252C%2520dramatic%2520lighting%252C%2520appetizing%2520presentation%252C%2520isolated%2520on%2520light%2520neutral%2520background%252C%2520high%2520resolution&width=400&height=400&seq=6&orientation=squarish',
      quantity: 1,
      options: ['Extra Spicy', 'No Onions'],
      notes: 'Extra sauce on the side please',
      size: 'L',
    },
  ]);

  const { isMobile } = useViewState();
  const { t } = useTranslation();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
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
    if (newQuantity < 1) return;

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setItemToRemove(null);
  };

  const confirmRemove = (id: string) => {
    setItemToRemove(id);
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

  return (
    <div className="relative flex flex-col min-h-screen p-4 border w-full max-w-5xl rounded-lg mx-auto">
      {/* Main Content */}
      <ScrollArea className="flex-1">
        {cartItems.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className={cn('space-y-4', isMobile ? 'mb-68' : 'mb-48')}>
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 border shadow-sm">
                <div className="gap-3 flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
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
                        onSubmit={() => itemToRemove && removeItem(itemToRemove)}
                        buttonSubmitLabel={t('module.menuManagement.cart.remove')}
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          className="group"
                          onClick={() => confirmRemove(item.id)}
                        >
                          <Trash className="size-5 group-hover:rotate-15 transition-transform duration-300 ease-in-out" />
                        </Button>
                      </CustomAlertDialog>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('module.menuManagement.cart.size')}:{' '}
                        <span className="font-medium text-black">{item.size}</span>
                      </div>
                      <div className="mt-1 mb-2">
                        <span className="text-black font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {item.options && item.options.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {item.options.map((opt) => (
                          <Badge key={opt} variant="outline" className="text-xs text-muted-foreground">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {item.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{item.notes}"</p>}

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-full"
                        >
                          <Minus />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-full"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <div className="text-right text-primary">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t('module.menuManagement.cart.tax', { taxRate: tax.toFixed(2) })}
                </span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-800 font-semibold">{t('module.menuManagement.cart.total')}</span>
                <span className="text-gray-800 font-semibold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="col-span-2 md:col-span-1">
                {t('module.menuManagement.cart.continueShopping')}
              </Button>

              <Button variant="default" className="col-span-2 md:col-span-1">
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
