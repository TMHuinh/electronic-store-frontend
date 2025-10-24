import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Card, Row, Col, Button, Pagination, Badge } from "react-bootstrap";
import { FaStar, FaUserCircle } from "react-icons/fa";

const ListReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [productName, setProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosClient.get(`/reviews/product/${id}`);
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sorted);
        if (sorted.length > 0) setProductName(sorted[0].product?.name || "");
      } catch (error) {
        console.log("Lỗi tải review", error);
      }
    };

    fetchReviews();
  }, [id]);

  // Pagination
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-primary mb-0">
          Đánh giá sản phẩm: {productName}
        </h3>
        <Link to={`/product/${id}`} className="btn btn-outline-secondary btn-sm">
          ← Quay lại sản phẩm
        </Link>
      </div>

      {currentReviews.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Chưa có đánh giá nào.</p>
        </div>
      ) : (
        <Row>
          {currentReviews.map((r) => (
            <Col xs={12} key={r._id}>
              <Card className="mb-3 shadow-sm border-0 border-start border-4 border-primary">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    {/* Avatar */}
                    <FaUserCircle size={40} className="me-3 text-secondary" />
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{r.user?.name || "Người dùng ẩn danh"}</strong>
                        <small className="text-muted">
                          {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                        </small>
                      </div>

                      {/* Sao đánh giá */}
                      <div className="my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`me-1 ${
                              i < r.rating ? "text-warning" : "text-secondary"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Nội dung */}
                      <Card.Text className="mt-2">{r.comment}</Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === currentPage}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ListReview;
