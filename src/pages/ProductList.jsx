import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import productApi from "../api/productApi";

const ProductList = () => {
  const { id } = useParams();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(16);
  const navigate = useNavigate();

  // ⭐ Hàm hiển thị sao
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-warning" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      else stars.push(<FaRegStar key={i} className="text-muted" />);
    }
    return stars;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let params = {};
        if (location.pathname.startsWith("/category/")) {
          params.category = id;
        } else if (location.pathname.startsWith("/brand/")) {
          params.brand = id;
        }
        const res = await productApi.getAll(params);
        const data = res.data || [];
        setAllProducts(data);
        setVisibleProducts(data.slice(0, itemsToShow));
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, location.pathname, itemsToShow]);

  const handleLoadMore = () => {
    const nextItems = allProducts.slice(0, visibleProducts.length + 8);
    setVisibleProducts(nextItems);
  };

  // Xác định tiêu đề dựa vào URL
  let title = "Danh sách sản phẩm";
  if (location.pathname.startsWith("/category/")) title = "Sản phẩm theo danh mục";
  else if (location.pathname.startsWith("/brand/")) title = "Sản phẩm theo thương hiệu";

  return (
    <Container className="mt-2">
      <h2 className="fw-bold text-primary mb-5 text-center">{title}</h2>
      <br />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {visibleProducts.length === 0 ? (
              <Col className="text-center text-muted py-5">
                Không có sản phẩm nào.
              </Col>
            ) : (
              visibleProducts.map((p) => (
                <Col key={p._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card
                    className="shadow-sm border-0 rounded-4 cursor-pointer h-100"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        p.images?.[0]?.url ||
                        "https://res.cloudinary.com/dxjvlcd5s/image/upload/v1760331029/products/bqlaqfriqvzfnagwpoic.jpg"
                      }
                      alt={p.name}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "1rem",
                        borderTopRightRadius: "1rem",
                      }}
                    />
                    <Card.Body>
                      <Card.Title
                        className="text-truncate"
                        title={p.name}
                      >
                        {p.name}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        <span className="fw-bold text-primary">
                          {p.price?.toLocaleString()}₫
                        </span>
                      </Card.Text>

                      {/* ⭐ Thêm sao đánh giá */}
                      <div className="d-flex align-items-center">
                        {renderStars(p.rating || 0)}
                        <small className="text-muted ms-1">
                          ({p.numReviews || 0})
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {visibleProducts.length < allProducts.length && (
            <div className="text-center my-4">
              <Button variant="outline-primary" onClick={handleLoadMore}>
                Tải thêm
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList;
