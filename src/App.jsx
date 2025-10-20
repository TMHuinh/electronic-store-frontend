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

// TitleHandler component
const TitleHandler = () => {
  const location = useLocation();
  const params = useParams(); // Truyền dynamic params từ Route

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
        else if (location.pathname.startsWith("/profile")) title = "Thông tĩn";

        // Trang chi tiết sản phẩm
        else if (location.pathname.startsWith("/product/")) {
          const id = location.pathname.split("/")[2];
          const res = await axiosClient.get(`/products/${id}`);
          title = res.data.name;
        }
        // Trang danh mục
        else if (location.pathname.startsWith("/category/")) {
          const id = location.pathname.split("/")[2];
          const res = await axiosClient.get(`/categories/${id}`);
          title = res.data.name;
        }
        // Trang đánh giá
        else if (location.pathname.startsWith("/reviews/product/")) {
          const id = location.pathname.split("/")[3];
          const res = await axiosClient.get(`/products/${id}`);
          title = `Đánh giá ${res.data.name}`;
        }
        else if (location.pathname.startsWith("/brand/")) {
          const id = location.pathname.split("/")[2];
          if (id) {
            const res = await axiosClient.get(`/brands/${id}`);
            title = res.data.name;
          }
        }

        document.title = `${title} | Electronic Store`;
      } catch (err) {
        console.error("Error fetching title:", err);
        document.title = "Electronic Store";
      }
    };

    fetchDynamicTitle();
  }, [location.pathname]);

  return null; // Không render gì cả
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <TitleHandler />
      <main className="py-5 mt-1">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/category/:id" element={<ProductList />} />
            <Route path="/search/:keyword" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/reviews/product/:id" element={<ListReview />} />
            <Route path="/brand/:id" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
