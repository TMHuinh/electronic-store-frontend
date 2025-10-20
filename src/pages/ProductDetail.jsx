import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Carousel, Button, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const { addItem } = useCart();

  // Hiển thị sao trung bình hoặc sao từng review
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const user = storedUser ? JSON.parse(storedUser) : null;
    setUserInfo(user);

    const fetchProductAndReviews = async () => {
      try {
        // Lấy product
        const resProduct = await axiosClient.get(`/products/${id}`, {
          headers: user ? { Authorization: `Bearer ${user.token}` } : {},
        });
        setProduct(resProduct.data);

        // Lấy tất cả review
        const resReviews = await axiosClient.get(`/reviews/product/${id}`);
        const sortedReviews = resReviews.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sortedReviews);
      } catch (error) {
        toast.error("Không tải được sản phẩm hoặc đánh giá");
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error("Vui lòng đăng nhập để đánh giá");

    try {
      const res = await axiosClient.post(
        `/reviews/product/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      toast.success("Đánh giá thành công!");
      setReviews(prev => [res.data.review, ...prev]);
      setProduct(res.data.product); // cập nhật rating & numReviews
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đánh giá");
    }
  };

  const handleAddToCart = () => toast.success("Đã thêm vào giỏ hàng!");

  if (!product) return <p>Đang tải...</p>;

  // Tính trung bình sao ngay frontend nếu backend chưa trả rating
  const averageRating =
    product.rating && product.rating > 0
      ? product.rating
      : reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

  return (
    <div className="container py-4">
      <Row>
        <Col md={6}>
          {product.images?.length ? (
            <Carousel variant="dark">
              {product.images.map((img, index) => (
                <Carousel.Item key={img.public_id || index}>
                  <img
                    className="d-block w-100 rounded"
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
              className="img-fluid rounded"
            />
          )}
        </Col>

        <Col md={6}>
          <h2>{product.name}</h2>
          <div className="d-flex align-items-center mb-2">
            {renderStars(averageRating)}
            <span className="ms-2">
              ({product.numReviews || reviews.length} đánh giá)
            </span>
          </div>

          <h3 className="text-danger">{product.price.toLocaleString()}₫</h3>
          <p>
            {product.stock > 0 ? (
              <Badge bg="success">Còn hàng</Badge>
            ) : (
              <Badge bg="secondary">Hết hàng</Badge>
            )}
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              min={1}
              max={product.stock}
              onChange={e => setQuantity(Number(e.target.value))}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={() => addItem(product._id, quantity)}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleAddToCart();
                navigate("/cart");
              }}
              disabled={product.stock === 0}
            >
              Mua ngay
            </Button>
          </div>

          <p className="mt-3">{product.description}</p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <h4>Đánh giá sản phẩm</h4>
          {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
          {reviews.slice(0, 2).map(r => (
            <Card key={r._id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <strong>{r.user?.name || "Ẩn danh"}</strong>
                  <div>{renderStars(r.rating)}</div>
                </div>
                <Card.Text className="mt-2">{r.comment}</Card.Text>
                <small className="text-muted">
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          ))}

          {reviews.length > 2 && (
            <Button
              variant="link"
              onClick={() => navigate(`/reviews/product/${id}`)}
              style={{ textDecoration: "none", color: "#0d6efd", padding: 0 }}
            >
              Xem thêm bình luận
            </Button>
          )}
        </Col>

        <Col md={6}>
          <h4>Thêm đánh giá</h4>
          {userInfo ? (
            product.canReview ? (
              <Form onSubmit={submitReview}>
                <Form.Group className="mb-2">
                  <Form.Label>Chọn sao</Form.Label>
                  <div>
                    {[1, 2, 3, 4, 5].map(num => (
                      <FaStar
                        key={num}
                        className={`me-1 cursor-pointer ${num <= rating ? "text-warning" : "text-secondary"
                          }`}
                        onClick={() => setRating(num)}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Nhận xét</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Gửi đánh giá
                </Button>
              </Form>
            ) : (
              <p className="text-muted">
                Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng.
              </p>
            )
          ) : (
            <p className="text-muted">Đăng nhập để đánh giá sản phẩm</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
