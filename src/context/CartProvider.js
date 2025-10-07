"use client";

import { createContext, useEffect, useState, useCallback } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartdetails, setCartDetails] = useState([]);
  const [latestProductsById, setLatestProductsById] = useState({});

  useEffect(() => {
    const storedCart = localStorage.getItem("cartdetails");
    setCartDetails(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const updateCartDetails = useCallback((details) => {
    setCartDetails(details);
    localStorage.setItem("cartdetails", JSON.stringify(details));
  }, []);

  const isSameCartLine = useCallback((a, b) => {
    const productIdA = a?.product?.id;
    const productIdB = b?.product?.id;
    const saleDetailIdA = a?.saleDetail?.id ?? null;
    const saleDetailIdB = b?.saleDetail?.id ?? null;
    const secondarySaleDetailIdA = a?.secondarySaleDetail?.id ?? null;
    const secondarySaleDetailIdB = b?.secondarySaleDetail?.id ?? null;
    return (
      productIdA === productIdB &&
      saleDetailIdA === saleDetailIdB &&
      secondarySaleDetailIdA === secondarySaleDetailIdB
    );
  }, []);

  const addItemToCart = useCallback((item) => {
    setCartDetails((prevCart = []) => {
      const existingItem = prevCart.find((detail) => isSameCartLine(detail, item));
      const updatedCart = existingItem
        ? prevCart.map((detail) =>
          isSameCartLine(detail, item) ? { ...detail, quantity: (Number(detail.quantity) || 0) + 1 } : detail
        )
        : [...prevCart, { ...item, quantity: 1 }];

      localStorage.setItem("cartdetails", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, [isSameCartLine]);

  // Fetch latest product details for items in cart so pricing stays up to date
  useEffect(() => {
    const loadLatest = async () => {
      const ids = Array.from(new Set(cartdetails.map(d => d?.product?.id).filter(Boolean)));
      if (!ids.length) {
        setLatestProductsById({});
        return;
      }
      try {
        const entries = await Promise.all(ids.map(async (id) => {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data?.id ? [data.id, data] : null;
        }));
        const map = {};
        entries.forEach(e => { if (e) { const [id, product] = e; map[id] = product; } });
        setLatestProductsById(map);
      } catch (_) {
        // ignore errors, fall back to existing product data in cart
      }
    };
    loadLatest();
  }, [cartdetails]);

  const removeItemFromCart = useCallback((item) => {
    updateCartDetails(cartdetails.filter((detail) => !isSameCartLine(detail, item)));
  }, [cartdetails, updateCartDetails, isSameCartLine]);

  const removeAllItems = useCallback(() => {
    updateCartDetails([]);
  }, [updateCartDetails]);

  const updateItemQuantityInCart = useCallback((item, quantity) => {
    updateCartDetails(
      cartdetails.map((detail) =>
        isSameCartLine(detail, item) ? { ...detail, quantity: Number(quantity) } : detail
      )
    );
  }, [cartdetails, updateCartDetails, isSameCartLine]);

  // Compute unit price for a cart line using selected sale details, falling back to lowest visible price
  const getPrice = useCallback((saleDetail, secondarySaleDetail, detail) => {
    const productId = detail?.product?.id;
    const product = (productId && latestProductsById[productId]) || detail?.product;
    const saleDetails = product?.saleDetails || [];

    const pickPrice = (sd) => ((sd?.promotionalPrice ?? 0) > 0 ? sd.promotionalPrice : (sd?.price ?? 0)) || 0;

    // Prefer user's selected combination if it still exists
    let matched = null;
    if (secondarySaleDetail?.id) matched = saleDetails.find(sd => sd?.id === secondarySaleDetail.id) || null;
    if (!matched && saleDetail?.id) matched = saleDetails.find(sd => sd?.id === saleDetail.id) || null;
    if (matched) return pickPrice(matched);

    // Fallback: lowest effective price among visible items
    const effective = saleDetails.filter(sd => sd?.showPrice === true && pickPrice(sd) > 0).map(pickPrice);
    if (!effective.length) return 0;
    return Math.min(...effective);
  }, [latestProductsById]);

  const getTotal = useCallback(() => {
    return cartdetails.reduce((total, detail) => {
      const unit = getPrice(detail.saleDetail, detail.secondarySaleDetail, detail);
      return total + unit * (detail.quantity || 1);
    }, 0);
  }, [cartdetails, getPrice]);

  return (
    <CartContext.Provider
      value={{
        cartdetails,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantityInCart,
        getPrice,
        getTotal,
        removeAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
