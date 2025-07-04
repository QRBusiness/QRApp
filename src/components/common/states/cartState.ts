import { USER_CART_STORAGE } from '@/constants';
import { proxy, useSnapshot } from 'valtio';
import { loadFromSessionStorage, saveToSessionStorage } from '@/libs/utils';

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  variant: string;
  options: string[];
  note: string;
}

const initialCart = {
  items: [] as CartItem[],
  totalQuantity: 0,
  totalPrice: 0,
};

const initialCartFromStorage: typeof initialCart = loadFromSessionStorage(USER_CART_STORAGE, initialCart);

const cartState = proxy(initialCartFromStorage);

export const addToCart = (item: CartItem) => {
  const existingItemIndex = cartState.items.findIndex((cartItem) => cartItem._id === item._id);

  if (existingItemIndex > -1) {
    // Update existing item
    cartState.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cartState.items.push(item);
  }
  updateCartTotals();
  saveToSessionStorage(USER_CART_STORAGE, cartState);
};

function updateCartTotals() {
  cartState.totalQuantity = cartState.items.reduce((total, item) => total + item.quantity, 0);
  cartState.totalPrice = cartState.items.reduce((total, item) => total + item.quantity * item.price, 0);
}

export const updateCartItemQuantity = (itemId: string, quantity: number) => {
  const itemIndex = cartState.items.findIndex((item) => item._id === itemId);
  if (itemIndex > -1 && quantity > 0) {
    cartState.items[itemIndex].quantity = quantity;
    updateCartTotals();
    saveToSessionStorage(USER_CART_STORAGE, cartState);
  }
};

export const removeFromCart = (itemId: string) => {
  cartState.items = cartState.items?.filter((item) => item._id !== itemId);
  updateCartTotals();
  saveToSessionStorage(USER_CART_STORAGE, cartState);
};

export const clearCart = () => {
  cartState.items = [];
  cartState.totalQuantity = 0;
  cartState.totalPrice = 0;
  saveToSessionStorage(USER_CART_STORAGE, cartState);
};

export const useCartItems = () => {
  const cartSnapshot = useSnapshot(cartState);
  return {
    items: cartSnapshot.items,
  };
};

export const useCartTotalQuantity = () => {
  const cartSnapshot = useSnapshot(cartState);
  return {
    totalQuantity: cartSnapshot.totalQuantity,
  };
};

export const useCartTotalPrice = () => {
  const cartSnapshot = useSnapshot(cartState);
  return {
    totalPrice: cartSnapshot.totalPrice,
  };
};

export const useCartState = () => {
  const cartSnapshot = useSnapshot(cartState);
  return {
    items: cartSnapshot.items,
    totalQuantity: cartSnapshot.totalQuantity,
    totalPrice: cartSnapshot.totalPrice,
  };
};
