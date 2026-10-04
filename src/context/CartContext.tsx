import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { success, error } = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const res = await api.cart.getCart();
      if (res.data?.items) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('[CartContext] Failed to load cart:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.cart.addToCart(productId, quantity);
      if (res.data?.items) {
        setItems(res.data.items);
        success(res.message || 'Added to shopping cart!');
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Could not add product to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const res = await api.cart.updateQuantity(itemId, quantity);
      if (res.data?.items) {
        setItems(res.data.items);
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Failed to update quantity');
      return false;
    }
  };

  const removeItem = async (itemId: string): Promise<boolean> => {
    try {
      const res = await api.cart.removeItem(itemId);
      if (res.data?.items) {
        setItems(res.data.items);
        success('Item removed from cart');
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await api.cart.clearCart();
      setItems([]);
    } catch (err: any) {
      error(err.message || 'Failed to clear cart');
    }
  };

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
  );
  const shippingCost = items.length === 0 ? 0 : subtotal >= 999 ? 0 : 99;
  const totalAmount = Number((subtotal + shippingCost).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingCost,
        totalAmount,
        loading,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
