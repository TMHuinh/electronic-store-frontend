import axiosClient from "./axiosClient";

const categoryApi = {
  // Lấy toàn bộ danh mục
  getAll: () => axiosClient.get("/categories"),

  // Lấy danh mục theo ID
  getById: (id) => axiosClient.get(`/categories/${id}`),

  // Tạo danh mục mới
  create: (data, token) =>
    axiosClient.post("/categories", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Cập nhật danh mục
  update: (id, data, token) =>
    axiosClient.put(`/categories/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Xóa danh mục
  delete: (id, token) =>
    axiosClient.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default categoryApi;
