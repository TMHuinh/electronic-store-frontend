import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import productApi from "../api/productApi";
import { useCart } from "../context/CartContext";
import {
  Carousel,
  Button,
  Row,
  Col,
  Form,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const [canReview, setCanReview] = useState(false);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-warning" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      else stars.push(<FaRegStar key={i} className="text-muted" />);
    }
    return stars;
  };

  // Load product, reviews, related
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserInfo(storedUser ? JSON.parse(storedUser) : null);

    const fetchData = async () => {
      try {
        // Product
        const resProduct = await axiosClient.get(`/products/${id}`, {
          headers: storedUser
            ? { Authorization: `Bearer ${JSON.parse(storedUser).token}` }
            : {},
        });
        const productData = resProduct.data;
        setProduct(productData);

        // Reviews
        const resReviews = await axiosClient.get(`/reviews/product/${id}`);
        setReviews(
          resReviews.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );

        // Related products
        if (productData.category?._id || productData.category) {
          const categoryId =
            typeof productData.category === "object"
              ? productData.category._id
              : productData.category;
          const resRelated = await productApi.getAll({ category: categoryId });
          setRelated(
            resRelated.data
              .filter((p) => p._id !== productData._id)
              .slice(0, 6)
          );
        }

        // Can review
        if (storedUser && productData?._id) {
          try {
            const check = await axiosClient.get(
              `/reviews/can-review/${productData._id}`,
              { headers: { Authorization: `Bearer ${JSON.parse(storedUser).token}` } }
            );
            setCanReview(check.data.canReview);
          } catch {
            setCanReview(false);
          }
        }
      } catch (err) {
        toast.error("Không tải được sản phẩm hoặc đánh giá");
      }
    };

    fetchData();
  }, [id]);

  // Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.info("Vui lòng đăng nhập để đánh giá");
      navigate("/login");
      return;
    }

    try {
      const res = await axiosClient.post(
        `/reviews/product/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      toast.success("Đánh giá thành công!");
      setReviews((prev) => [res.data.review, ...prev]);
      setProduct(res.data.product);
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đánh giá");
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.info("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    try {
      await addItem(product._id, quantity);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error(err.message || "Thêm giỏ hàng thất bại");
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      navigate("/login");
    }
  };

  if (!product)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" /> <p>Đang tải sản phẩm...</p>
      </div>
    );

  const averageRating =
    product.rating && product.rating > 0
      ? product.rating
      : reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container py-4">
      {/* Product Info */}
      <Row className="g-4">
        <Col md={6}>
          {product.images?.length ? (
            <Carousel variant="dark">
              {product.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100 rounded shadow-sm"
                    src={img.url}
                    alt={product.name}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <img
              src="/placeholder.png"
              alt={product.name}
              className="img-fluid rounded shadow-sm"
            />
          )}
        </Col>

        <Col md={6}>
          <h3 className="fw-semibold">{product.name}</h3>
          <div className="d-flex align-items-center mb-2">
            {renderStars(averageRating)}
            <span className="ms-2 text-muted">
              ({product.numReviews || reviews.length} đánh giá)
            </span>
          </div>

          <h3 className="text-danger fw-bold mb-3">
            {product.price.toLocaleString()}₫
          </h3>

          <div className="mb-3">
            {product.stock > 0 ? (
              <Badge bg="success">Còn hàng</Badge>
            ) : (
              <Badge bg="secondary">Hết hàng</Badge>
            )}
          </div>

          <Form.Group className="mb-3 w-50">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              min={1}
              max={product.stock}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>

          <div className="d-flex gap-3 mb-3">
            <Button
              variant="outline-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FaShoppingCart className="me-2" /> Thêm vào giỏ
            </Button>

            <Button
              variant="danger"
              onClick={async () => {
                await handleAddToCart();
                navigate("/cart");
              }}
              disabled={product.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          <Card className="p-3 border-0 shadow-sm bg-light">
            <Card.Body>
              <h5 className="fw-bold">Mô tả sản phẩm</h5>
              <Card.Text className="text-secondary">{product.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews */}
      <Row className="mt-5 g-4">
        <Col md={6}>
          <h4 className="fw-semibold mb-3">Đánh giá sản phẩm</h4>
          {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}

          {reviews.slice(0, 2).map((r) => (
            <Card key={r._id} className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <strong>{r.user?.name || "Ẩn danh"}</strong>
                  <div>{renderStars(r.rating)}</div>
                </div>
                <Card.Text className="mt-2">{r.comment}</Card.Text>
                <small className="text-muted">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </small>
              </Card.Body>
            </Card>
          ))}

          {reviews.length > 2 && (
            <div className="text-center mt-2">
              <Button
                variant="link"
                className="text-decoration-none"
                onClick={() => navigate(`/reviews/product/${id}`)}
              >
                Xem tất cả đánh giá ({reviews.length})
              </Button>
            </div>
          )}
        </Col>

        {/* Add Review */}
        <Col md={6}>
          <h4 className="fw-semibold mb-3">Thêm đánh giá của bạn</h4>
          {userInfo ? (
            canReview ? (
              !reviews.some((r) => r.user?._id === userInfo._id) ? (
                <Form onSubmit={submitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chọn sao</Form.Label>
                    <div>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar
                          key={num}
                          className={`me-1 fs-4 cursor-pointer ${
                            num <= rating ? "text-warning" : "text-muted"
                          }`}
                          onClick={() => setRating(num)}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nhận xét</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Chia sẻ cảm nhận của bạn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="success" className="w-100">
                    Gửi đánh giá
                  </Button>
                </Form>
              ) : (
                <p className="text-muted">Bạn đã đánh giá sản phẩm này rồi.</p>
              )
            ) : (
              <p className="text-muted">
                Bạn chỉ có thể đánh giá sau khi đã mua và nhận hàng sản phẩm này.
              </p>
            )
          ) : (
            <p className="text-muted">
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="p-0 text-decoration-none"
              >
                Đăng nhập
              </Button>{" "}
              để đánh giá sản phẩm.
            </p>
          )}
        </Col>
      </Row>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-semibold mb-4">Sản phẩm liên quan</h4>
          <Row xs={2} md={3} lg={4} className="g-4">
            {related.map((item) => (
              <Col key={item._id}>
                <Card
                  className="h-100 shadow-sm border-0 hover-shadow"
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    style={{ height: "200px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <Card.Body>
                    <Card.Title className="fs-6 text-truncate" title={item.name}>
                      {item.name}
                    </Card.Title>
                    <div className="text-danger fw-bold mb-2">
                      {item.price.toLocaleString()}₫
                    </div>
                    <div>{renderStars(item.rating || 0)}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
