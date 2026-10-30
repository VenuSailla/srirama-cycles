'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sri_rama_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('sri_rama_cart', JSON.stringify(cart));
      } catch (e) {
        console.warn('Could not save cart to localStorage', e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product, quantity = 1, size = 'Standard') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item._id === product._id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const updatedQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(updatedQty, product.stock || 99),
        };
        return next;
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || '',
          selectedSize: size,
          stock: product.stock,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, newQty, size = '') => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId && (!size || item.selectedSize === size)) {
          return { ...item, quantity: Math.min(newQty, item.stock || 99) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, size = '') => {
    setCart((prev) =>
      prev.filter((item) => !(item._id === productId && (!size || item.selectedSize === size)))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThreshold = 20000;
  const shippingCost = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : 499;
  const cartTotal = cartSubtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        shippingCost,
        shippingThreshold,
        cartTotal,
        isLoaded,
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
