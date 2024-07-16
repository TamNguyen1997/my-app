"use client"

import { createContext, useCallback, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartdetails, setCartDetails] = useState([]);

  const addItemToCart = (e) => {
    updateCartDetails([...cartdetails, e])
  };

  const removeItemFromCart = (item) => {
    updateCartDetails(cartdetails.filter(detail => detail.product.id !== item.product.id))
  };

  const updateItemQuantityInCart = (item, quantity) => {
    let cart = [...cartdetails]
    cart.forEach(detail => {
      if (detail.product.id === item.product.id) {
        detail.quantity = quantity
      }
    })
    updateCartDetails(cart)
  };

  const updateCartDetails = (details) => {
    setCartDetails(details)
    localStorage.setItem('cartdetails', JSON.stringify(details));
  }

  const getPrice = (saleDetail, secondarySaleDetail) => {
    if (secondarySaleDetail.price) return secondarySaleDetail.price
    if (!secondarySaleDetail.price && saleDetail.price) return saleDetail.price

    return 0
  }

  const getTotal = useCallback(() => {
    let total = 0
    cartdetails.forEach(detail => {
      total += getPrice(0, detail.saleDetail, detail.secondarySaleDetail) * (detail.quantity || 1)
    });
    return total
  }, [cartdetails])

  useEffect(() => {
    const cartdetails = JSON.parse(localStorage.getItem('cartdetails'));
    if (cartdetails) {
      setCartDetails(cartdetails);
    }
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartdetails,
        setCartDetails,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantityInCart,
        getTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;