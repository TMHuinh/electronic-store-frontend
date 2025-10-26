import { useEffect, useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import categoryApi from "../api/categoryApi";
import axiosClient from "../api/axiosClient";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Lấy danh mục
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

  // Lấy brand
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosClient.get("/brands");
        setBrands(res.data || []);
      } catch (err) {
        console.error("Lỗi tải brand:", err);
      }
    };
    fetchBrands();
  }, []);

  return (
    <footer className="bg-light border-top pt-5 mt-5">
      <Container>
        <Row>
          {/* Thông tin cửa hàng */}
          <Col md={4} className="mb-4">
            <h5 className="text-primary fw-bold">HUINH</h5>
            <p className="small text-muted">
              Cung cấp thiết bị điện tử chính hãng, chất lượng cao và giá tốt nhất.
            </p>
            <p className="mb-1 text-muted">📧 support@estore.vn</p>
            <p className="text-muted">📞 0123 456 789</p>
          </Col>

          {/* Danh mục */}
          <Col md={2} className="mb-4">
            <h6 className="fw-bold text-dark text-uppercase">Danh mục</h6>
            <Nav className="flex-column">
              {categories.map((cat) => (
                <Nav.Link
                  as={Link}
                  key={cat._id}
                  to={`/category/${cat._id}`}
                  className="text-muted px-0 py-1"
                >
                  {cat.name}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Brand */}
          <Col md={3} className="mb-4">
            <h6 className="fw-bold text-dark text-uppercase">Thương hiệu</h6>
            <Nav className="flex-column">
              {brands.map((b) => (
                <Nav.Link
                  as={Link}
                  key={b._id}
                  to={`/brand/${b._id}`}
                  className="text-muted px-0 py-1"
                >
                  {b.name}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Mạng xã hội */}
          <Col md={3} className="mb-4">
            <h6 className="fw-bold text-dark text-uppercase">Theo dõi chúng tôi</h6>
            <div className="d-flex gap-3 fs-5">
              <a href="#" className="text-primary"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-primary"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-primary"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-primary"><i className="fab fa-youtube"></i></a>
            </div>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className="text-center text-muted small py-3">
            © {new Date().getFullYear()} HUINH. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
