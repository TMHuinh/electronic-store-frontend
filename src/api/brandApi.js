import axiosClient from "./axiosClient";

const brandApi = {
  getAll: () => axiosClient.get("/brands"),
  getById: (id) => axiosClient.get(`/brands/${id}`),
  create: (data) => axiosClient.post("/brands", data),
  update: (id, data) => axiosClient.put(`/brands/${id}`, data),
  delete: (id) => axiosClient.delete(`/brands/${id}`),
};

export default brandApi;
