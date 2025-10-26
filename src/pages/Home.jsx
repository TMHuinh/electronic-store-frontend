import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Carousel,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import productApi from "../api/productApi";
import categoryApi from "../api/categoryApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proRes, catRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ]);
        setProducts(proRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const flashSale = products.slice(0, 4);
  const featured = products.slice(4, 12);

  return (
    <div className="home-page">
      {/* 🔹 1. Slider */}
      <Carousel fade className="shadow-sm rounded mb-4">
        <Carousel.Item>
          <img
            className="d-block w-100 rounded"
            src="https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760978844/products/ezux3gpyahq7zqzonon3.png"
            alt="Slide 1"
            style={{ height: "450px", objectFit: "" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 rounded"
            src="https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760980888/products/tmyekxt3q0t11mreabqf.jpg"
            alt="Slide 2"
            style={{ height: "450px", objectFit: "" }}
          />
        </Carousel.Item>
      </Carousel>

      {/* ⚡ 3. Flash Sale */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-danger">
            ⚡ Flash Sale
          </h3>
          <Button variant="outline-danger" onClick={() => navigate("/products")}>
            Xem tất cả
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : (
          <Row className="g-4">
            {flashSale.map((p) => (
              <Col key={p._id} xs={12} sm={6} md={3}>
                <Card
                  className="border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                  onClick={() => navigate(`/product/${p._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="position-relative">
                    <Card.Img
                      src={
                        p.images?.[0]?.url ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={p.name}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      -20%
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="text-truncate">{p.name}</Card.Title>
                    <div className="fw-bold text-danger">
                      {p.price?.toLocaleString()}₫
                    </div>
                    <Button variant="outline-danger" className="w-100 mt-2">
                      Mua ngay
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* 🛍️ 4. Sản phẩm nổi bật */}
      <Container className="mb-5">
        <h3 className="fw-bold text-primary mb-3">Sản phẩm nổi bật</h3>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Row className="g-4">
              {featured.map((p) => (
                <Col key={p._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className="border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                    onClick={() => navigate(`/product/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      variant="top"
                      src={p.images?.[1]?.url ||
                        "https://bizweb.dktcdn.net/thumb/1024x1024/100/228/168/products/sdp1.jpg?v=1582190218723"}
                      alt={p.name}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="text-truncate">{p.name}</Card.Title>
                      <div className="fw-bold text-primary">
                        {p.price?.toLocaleString()}₫
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Nút Xem tất cả ở dưới */}
            <div className="text-center mt-4">
              <Button variant="outline-primary" onClick={() => navigate("/products")}>
                Xem tất cả
              </Button>
            </div>
          </>
        )}
      </Container>

      {/* 🔸 2. Banner phụ */}
      <Container className="mb-5">
        <Row className="g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img
                src="https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760980019/products/mg2e1cgkxap01dhc6uk7.jpg"
                alt="Banner 1"
                style={{ height: "220px", objectFit: "" }}
              />
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img
                src="https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760981074/products/ggduoo62ic9op12dibit.webp"
                alt="Banner 2"
                style={{ height: "220px", objectFit: "" }}
              />
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img
                src="https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760981387/products/ysua5eppa73ygutcm4qt.jpg"
                alt="Banner 3"
                style={{ height: "220px", objectFit: "" }}
              />
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Home;
