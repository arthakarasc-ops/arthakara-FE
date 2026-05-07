"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCart, addToCart, updateCartQty, removeFromCart, clearCart } from "@/lib/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend if authenticated
  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    const { status, data } = await getCart(token);
    if (status === 200) {
      setCartItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, token]);

  const addItem = async (payload) => {
    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu untuk menambah ke keranjang.");
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    const { status, data } = await addToCart(token, payload);
    setLoading(false);

    if (status === 200 || status === 201) {
      fetchCart(); // Refresh cart
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error || "Gagal menambah ke keranjang" };
    }
  };

  const updateQty = async (cartId, qty) => {
    if (!token) return;
    setLoading(true);
    const { status, data } = await updateCartQty(token, cartId, qty);
    setLoading(false);

    if (status === 200) {
      fetchCart();
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const removeItem = async (cartId) => {
    if (!token) return;
    setLoading(true);
    const { status } = await removeFromCart(token, cartId);
    setLoading(false);

    if (status === 200) {
      fetchCart();
      return { success: true };
    } else {
      return { success: false };
    }
  };

  const clearAll = async () => {
    if (!token) return;
    setLoading(true);
    const { status } = await clearCart(token);
    setLoading(false);

    if (status === 200) {
      setCartItems([]);
      return { success: true };
    } else {
      return { success: false };
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        cartTotal,
        fetchCart,
        addItem,
        updateQty,
        removeItem,
        clearAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
