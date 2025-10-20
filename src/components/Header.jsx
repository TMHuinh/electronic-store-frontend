import React, { useEffect, useState, useRef } from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import categoryApi from "../api/categoryApi";
import axiosClient from "../api/axiosClient";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaPhoneAlt,
  FaTruck,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";


const Header = () => {
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;


  // 🗂️ Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // 👤 Lấy user
  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem("userInfo");
      setUserInfo(user ? JSON.parse(user) : null);
      setShowMenu(false);
    };
    loadUser();
    window.addEventListener("userChange", loadUser);
    return () => window.removeEventListener("userChange", loadUser);
  }, []);

  // 🧩 Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Gọi API gợi ý khi người dùng gõ
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (keyword.trim()) {
        try {
          const res = await axiosClient.get(`/products?keyword=${keyword}`);
          // chỉ lấy 5 sản phẩm đầu
          setSuggestions(res.data.slice(0, 5));
        } catch (err) {
          console.error("Lỗi gợi ý tìm kiếm:", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  // 🔎 Khi nhấn Enter hoặc click nút tìm
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setSuggestions([]);
    }
  };

  // 🚪 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    window.dispatchEvent(new Event("userChange"));
    navigate("/");
  };

  return (
    <header>
      {/* 🔹 Top bar phụ */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          fontSize: "0.9rem",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <Container>
          <Row className="py-2 align-items-center text-center text-md-start">
            <Col md={6} className="text-muted mb-2 mb-md-0">
              <FaPhoneAlt className="me-2 text-primary" />
              Hỗ trợ khách hàng: <strong>1900 123 456</strong>
            </Col>

            <Col md={6} className="text-md-end">
              <Nav className="justify-content-end small align-items-center flex-wrap">
                <LinkContainer to="/order-tracking">
                  <Nav.Link className="text-muted me-3 d-flex align-items-center">
                    <FaTruck className="me-1 text-secondary" />
                    Theo dõi đơn hàng
                  </Nav.Link>
                </LinkContainer>

                {!userInfo ? (
                  <>
                    <LinkContainer to="/login">
                      <Nav.Link className="text-muted me-2">Đăng nhập</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/register">
                      <Nav.Link className="text-muted">Đăng ký</Nav.Link>
                    </LinkContainer>
                  </>
                ) : (
                  <div className="position-relative d-inline-block" ref={menuRef}>
                    <button
                      className="btn btn-link text-muted d-inline-flex align-items-center p-0"
                      onClick={() => setShowMenu(!showMenu)}
                      style={{ textDecoration: "none", fontSize: "0.75rem" }}
                    >
                      <FaUser className="me-2 text-secondary" />
                      {userInfo.name}
                    </button>

                    {showMenu && (
                      <div
                        className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                        style={{ zIndex: 1000, minWidth: "150px" }}
                      >
                        <LinkContainer to="/profile">
                          <Nav.Link className="text-dark px-3 py-2">
                            Trang cá nhân
                          </Nav.Link>
                        </LinkContainer>

                        {userInfo.isAdmin && (
                          <>
                            <hr className="my-1" />
                            <LinkContainer to="/admin/dashboard">
                              <Nav.Link className="text-danger px-3 py-2">
                                Quản trị
                              </Nav.Link>
                            </LinkContainer>
                          </>
                        )}

                        <hr className="my-1" />
                        <Nav.Link
                          onClick={handleLogout}
                          className="text-dark px-3 py-2"
                        >
                          Đăng xuất
                        </Nav.Link>
                      </div>
                    )}
                  </div>
                )}
              </Nav>
            </Col>
          </Row>
        </Container>
      </div>

      {/* 🔸 Thanh chính */}
      <Navbar bg="white" className="py-3 shadow-sm">
        <Container className="align-items-center">
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-1 text-primary me-4"
          >
            E-Shop
          </Navbar.Brand>

          {/* Tìm kiếm + danh mục */}
          <Form
            className="d-flex flex-column mx-3 w-60 mx-auto mx-lg-3 position-relative"
            onSubmit={handleSearch}
          >
            <div className="d-flex position-relative">
              <FormControl
                type="search"
                placeholder="Tìm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="me-2"
                autoComplete="off"
              />
              <Button variant="primary" type="submit">
                <FaSearch />
              </Button>

              {/* Gợi ý */}
              {suggestions.length > 0 && (
                <ul
                  className="list-unstyled position-absolute bg-white border rounded shadow-sm mt-2"
                  style={{
                    top: "100%",
                    left: 0,
                    width: "100%",
                    zIndex: 2000,
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      className="px-3 py-2 d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onMouseDown={() => {
                        navigate(`/product/${item._id}`);
                        setSuggestions([]);
                        setKeyword("");
                      }}
                    >

                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Danh mục */}
            <Nav className="justify-content-center flex-wrap d-none d-lg-flex mt-2">
              {categories.slice(0, 5).map((cat) => (
                <Nav.Link
                  key={cat._id}
                  as={Link}
                  to={`/category/${cat._id}`}
                  className="text-dark fw-semibold mx-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {cat.name}
                </Nav.Link>
              ))}
            </Nav>
          </Form>

          {/* Giỏ hàng */}
          <div className="position-relative">
            <Button
              as={Link}
              to="/cart"
              variant="link"
              className="text-primary p-0 position-relative"
              style={{ textDecoration: "none" }}
            >
              <FaShoppingCart className="fs-3" />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.6rem" }}
              >
                {totalItems}
              </span>
            </Button>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
