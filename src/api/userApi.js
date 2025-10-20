import axiosClient from "./axiosClient";

const userApi = {
  register: (data) => axiosClient.post("/users/register", data),
  login: (data) => axiosClient.post("/users/login", data),
  getProfile: (token) =>
    axiosClient.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateProfile: (data, token) =>
    axiosClient.put("/users/profile", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default userApi;
