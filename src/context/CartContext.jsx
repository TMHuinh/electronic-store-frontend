import { createContext, useContext, useEffect, useState } from "react";
import cartApi from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchCart = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        const res = await cartApi.getMyCart();
        setCart(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const refreshCart = async () => {
    try {
      const res = await cartApi.getMyCart();
      setCart(res.data);
    } catch (err) {
      console.error("❌ Lỗi refresh giỏ hàng:", err);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await cartApi.addToCart({ productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("❌ Lỗi thêm sản phẩm:", err);
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await cartApi.updateQuantity({ productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await cartApi.removeFromCart(productId);
      setCart(res.data);
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart({ items: [] });
    } catch (err) {
      console.error("❌ Lỗi xóa toàn bộ giỏ:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
