"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image_url: string; slug: string }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load saved cart from browser storage when the app loads
  useEffect(() => {
    const savedCart = localStorage.getItem('wb_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart changes to browser storage automatically
  useEffect(() => {
    localStorage.setItem('wb_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: { id: string; name: string; price: number; image_url: string; slug: string }) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        // If product already exists in cart, increase quantity
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Otherwise add new item with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, subtotal }}>
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