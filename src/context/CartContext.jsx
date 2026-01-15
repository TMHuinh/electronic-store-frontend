import { createContext, useContext, useEffect, useState } from "react";
import cartApi from "../api/cartApi";
import Swal from "sweetalert2";

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
  }, [userInfo]);

  const refreshCart = async () => {
    try {
      const res = await cartApi.getMyCart();
      setCart(res.data);
    } catch (err) {
      console.error("❌ Lỗi refresh giỏ hàng:", err);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      throw new Error("Vui lòng đăng nhập để mua hàng");
    }

    try {
      const res = await cartApi.addToCart({ productId, quantity });
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Lỗi thêm sản phẩm:", err);
      throw err;
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

  const removeItem = async (productId, askConfirm = true) => {
    try {
      if (askConfirm) {
        const result = await Swal.fire({
          title: "Xác nhận",
          text: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        });
        if (!result.isConfirmed) return false;
      }

      const res = await cartApi.removeFromCart(productId);
      setCart(res.data);
      return true;
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      return false;
    }
  };

  const clearCart = async (askConfirm = true) => {
    try {
      if (askConfirm) {
        const result = await Swal.fire({
          title: "Xác nhận",
          text: "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        });
        if (!result.isConfirmed) return false;
      }

      await cartApi.clearCart();
      setCart({ items: [] });
      return true;
    } catch (err) {
      console.error("❌ Lỗi xóa toàn bộ giỏ:", err);
      return false;
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
