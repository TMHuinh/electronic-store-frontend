import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import ListReview from "./pages/ListReview";
import axiosClient from "./api/axiosClient";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import VerifyPage from "./pages/VerifyPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductAdminPage from "./pages/admin/ProductAdminPage";
import CategoryAdminPage from "./pages/admin/CategoryAdminPage";
import BrandAdminPage from "./pages/admin/BrandAdminPage";
import UserAdminPage from "./pages/admin/UserAdminPage";
import OrderAdminPage from "./pages/admin/OrderAdminPage";
import AdminRoute from "./components/AdminRoute";
import DashboardHome from "./pages/admin/DashboardHome";


const TitleHandler = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const fetchDynamicTitle = async () => {
      try {
        let title = "Electronic Store";

        if (location.pathname === "/") title = "Trang chủ";
        else if (location.pathname === "/login") title = "Đăng nhập";
        else if (location.pathname === "/register") title = "Đăng ký";
        else if (location.pathname.startsWith("/products")) title = "Danh sách sản phẩm";
        else if (location.pathname.startsWith("/search/")) title = "Kết quả tìm kiếm";
        else if (location.pathname.startsWith("/cart")) title = "Giỏ hàng";
        else if (location.pathname.startsWith("/profile")) title = "Thông tin cá nhân";
        else if (location.pathname.startsWith("/checkout")) title = "Thanh toán";
        else if (location.pathname.startsWith("/orders/")) title = "Chi tiết đơn hàng";
        else if (location.pathname.startsWith("/orders")) title = "Lịch sử đơn hàng";
        else if (location.pathname.startsWith("/verify/")) title = "Xác thực tài khoản";
        else if (location.pathname.startsWith("/admin/dashboard")) title = "Trang quản trị";
        else if (location.pathname.startsWith("/admin/products")) title = "Quản lý sản phẩm";
        else if (location.pathname.startsWith("/admin/categories")) title = "Quản lý danh mục";
        else if (location.pathname.startsWith("/admin/brands")) title = "Quản lý thương hiệu";
        else if (location.pathname.startsWith("/admin/users")) title = "Quản lý người dùng";
        else if (location.pathname.startsWith("/admin/orders")) title = "Quản lý đơn hàng";

        else if (location.pathname.startsWith("/product/")) {
          const id = location.pathname.split("/")[2];
          const res = await axiosClient.get(`/products/${id}`);
          title = res.data.name;
        } else if (location.pathname.startsWith("/category/")) {
          const id = location.pathname.split("/")[2];
          const res = await axiosClient.get(`/categories/${id}`);
          title = res.data.name;
        } else if (location.pathname.startsWith("/reviews/product/")) {
          const id = location.pathname.split("/")[3];
          const res = await axiosClient.get(`/products/${id}`);
          title = `Đánh giá ${res.data.name}`;
        } else if (location.pathname.startsWith("/brand/")) {
          const id = location.pathname.split("/")[2];
          const res = await axiosClient.get(`/brands/${id}`);
          title = res.data.name;
        }

        document.title = `${title} | Electronic Store`;
      } catch (err) {
        document.title = "Electronic Store";
      }
    };

    fetchDynamicTitle();
  }, [location.pathname]);

  return null;
};


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <TitleHandler />

      <main className="py-5 mt-1">
        <Routes>
          {/* 🎯 Layout người dùng có Container */}
          <Route
            path="/*"
            element={
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify/:token" element={<VerifyPage />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/category/:id" element={<ProductList />} />
                  <Route path="/search/:keyword" element={<SearchPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/reviews/product/:id" element={<ListReview />} />
                  <Route path="/brand/:id" element={<ProductList />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                </Routes>
              </Container>
            }
          />

          {/* 🧑‍💼 Layout admin không có Container */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminDashboard />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="products" element={<ProductAdminPage />} />
              <Route path="categories" element={<CategoryAdminPage />} />
              <Route path="brands" element={<BrandAdminPage />} />
              <Route path="users" element={<UserAdminPage />} />
              <Route path="orders" element={<OrderAdminPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
