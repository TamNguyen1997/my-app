"use client";

import { createContext, useEffect, useState, useCallback } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartdetails, setCartDetails] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartdetails");
    setCartDetails(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const updateCartDetails = useCallback((details) => {
    setCartDetails(details);
    localStorage.setItem("cartdetails", JSON.stringify(details));
  }, []);

  const addItemToCart = useCallback((item) => {
    setCartDetails((prevCart = []) => {
      const existingItem = prevCart.find((detail) => detail.product.id === item.product.id);
      const updatedCart = existingItem
        ? prevCart.map((detail) =>
          detail.product.id === item.product.id ? { ...detail, quantity: detail.quantity + 1 } : detail
        )
        : [...prevCart, { ...item, quantity: 1 }];

      localStorage.setItem("cartdetails", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const removeItemFromCart = useCallback((item) => {
    updateCartDetails(cartdetails.filter((detail) => detail.product.id !== item.product.id));
  }, [cartdetails, updateCartDetails]);

  const removeAllItems = useCallback(() => {
    updateCartDetails([]);
  }, [updateCartDetails]);

  const updateItemQuantityInCart = useCallback((item, quantity) => {
    updateCartDetails(
      cartdetails.map((detail) =>
        detail.product.id === item.product.id ? { ...detail, quantity } : detail
      )
    );
  }, [cartdetails, updateCartDetails]);

  const getPrice = (saleDetail, secondarySaleDetail, detail) => {
    return (
      detail.product?.saleDetails?.[0]?.price ||
      secondarySaleDetail?.price ||
      saleDetail?.price ||
      0
    );
  };

  const getTotal = useCallback(() => {
    return cartdetails.reduce(
      (total, detail) =>
        total + getPrice(detail.saleDetail, detail.secondarySaleDetail, detail) * (detail.quantity || 1),
      0
    );
  }, [cartdetails]);

  return (
    <CartContext.Provider
      value={{
        cartdetails,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantityInCart,
        getTotal,
        removeAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
