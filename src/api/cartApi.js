import axiosClient from "./axiosClient";

const getAuthHeader = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartApi = {
  getMyCart: () => axiosClient.get("/carts", { headers: getAuthHeader() }),

  addToCart: (data) =>
    axiosClient.post("/carts", data, { headers: getAuthHeader() }),

  updateQuantity: (data) =>
    axiosClient.put("/carts", data, { headers: getAuthHeader() }),

  removeFromCart: (productId) =>
    axiosClient.delete(`/carts/${productId}`, { headers: getAuthHeader() }),

  clearCart: () =>
    axiosClient.delete("/carts/clear", { headers: getAuthHeader() }),
};

export default cartApi;
