"use client";
import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [quantity, setQuantity] = useState({});
  const { showToast } = useToast();

  const addItem = (product) => {
    const isExisting = !!quantity[product.name];

    setQuantity((prev) => {
      const existing = prev[product.name];
      if (existing) {
        return {
          ...prev,
          [product.name]: {
            ...existing,
            qty: existing.qty + 1,
          },
        };
      } else {
        return {
          ...prev,
          [product.name]: {
            ...product,
            qty: 1,
          },
        };
      }
    });

    if (isExisting) {
      showToast(`Increased quantity of ${product.name}`);
    } else {
      showToast(`Added ${product.name} to cart`);
    }
  };

  const removeItem = (name) => {
    const existing = quantity[name];
    if (!existing) return;

    const willBeRemoved = existing.qty <= 1;

    setQuantity((prev) => {
      const item = prev[name];
      if (!item) return prev;

      const newQty = item.qty - 1;
      if (newQty <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [name]: {
          ...item,
          qty: newQty,
        },
      };
    });

    if (willBeRemoved) {
      showToast(`Removed ${name} from cart`, 'error');
    } else {
      showToast(`Decreased quantity of ${name}`);
    }
  };


  const clearCart = () => {
    setQuantity({});
  };

  const totalItems = Object.values(quantity).reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ quantity, addItem, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
