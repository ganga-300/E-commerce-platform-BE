"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [quantity, setQuantity] = useState({});

  const addItem = (product) => {
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
  };

  const removeItem = (name) => {
    setQuantity((prev) => {
      const existing = prev[name];
      if (!existing) return prev;

      const newQty = existing.qty - 1;
      if (newQty <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [name]: {
          ...existing,
          qty: newQty,
        },
      };
    });
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
