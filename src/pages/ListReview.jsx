import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Card, Row, Col, Button, Pagination } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const ListReview = () => {
  const { id } = useParams(); // productId
  const [reviews, setReviews] = useState([]);
  const [productName, setProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosClient.get(`/reviews/product/${id}`);
        // sort giảm dần theo ngày tạo
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      <h2>Đánh giá sản phẩm: {productName}</h2>
      <Link to={`/product/${id}`}>← Quay lại chi tiết sản phẩm</Link>

      {currentReviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        currentReviews.map((r) => (
          <Card key={r._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <strong>{r.user?.name || "Ẩn danh"}</strong>
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < r.rating ? "text-warning" : "text-secondary"}
                    />
                  ))}
                </div>
              </div>
              <Card.Text className="mt-2">{r.comment}</Card.Text>
              <small className="text-muted">
                {new Date(r.createdAt).toLocaleDateString()}
              </small>
            </Card.Body>
          </Card>
        ))
      )}

      {totalPages > 1 && (
        <Pagination className="mt-3">
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
      )}
    </div>
  );
};

export default ListReview;
