import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching shopping cart:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart automatically when the authenticated user profile changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart/add', { productId, quantity });
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put('/api/cart/update', { productId, quantity });
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error updating cart item quantity:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Backend routes support productId from query params
      const response = await axios.delete(`/api/cart/remove?productId=${productId}`);
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const clearCartState = () => {
    setCart({ userId: user?._id, products: [] });
  };

  // Derive helper fields for layout indicators
  const cartItemCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotalAmount = cart?.products?.reduce((total, item) => {
    const itemPrice = item.productId?.price || 0;
    return total + (itemPrice * item.quantity);
  }, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCartState,
      cartItemCount,
      cartTotalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
