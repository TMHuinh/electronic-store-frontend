import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Thêm token vào tất cả request nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Bắt lỗi 401 để xử lý tự động (token hết hạn hoặc sai)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token không hợp lệ hoặc đã hết hạn, cần đăng nhập lại");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      // Có thể tự động redirect:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
