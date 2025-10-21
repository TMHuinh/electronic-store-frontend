import axiosClient from "./axiosClient";

const cartApi = {
  getMyCart: () => axiosClient.get("/carts"),
  addToCart: (data) => axiosClient.post("/carts", data),
  updateQuantity: (data) => axiosClient.put("/carts", data),
  removeFromCart: (productId) => axiosClient.delete(`/carts/${productId}`),
  clearCart: () => axiosClient.delete("/carts/clear"),
  syncCart: (data) => axiosClient.post("/carts/sync", data),
};

export default cartApi;
