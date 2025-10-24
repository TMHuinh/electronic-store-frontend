import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import { toast } from "react-toastify";
import { Table, Badge, Spinner, Card, Row, Col, Image } from "react-bootstrap";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Badge bg="warning">Đang xử lý</Badge>;
      case "shipped":
        return <Badge bg="info">Đang giao</Badge>;
      case "delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-5">
        <h4>Không tìm thấy đơn hàng</h4>
        <Link to="/orders" className="btn btn-primary mt-3">
          Quay lại lịch sử đơn hàng
        </Link>
      </div>
    );

  return (
    <div className="container py-1">
      <h2 className="mb-5 fw-bold text-primary text-center">
        Chi tiết đơn hàng
      </h2>

      <Card className="mb-4 p-3">
        <Row className="mb-2">
          <Col md={6}>
            <h5>Thông tin giao hàng</h5>
            <p className="mb-1">
              <strong>Mã đơn hàng: </strong>#{order._id}
            </p>
            <p className="mb-1">
              <strong>Địa chỉ:</strong> {order.address}
            </p>
            <p className="mb-1">
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
            </p>
          </Col>
          <Col md={6}>
            <h5>Trạng thái đơn hàng</h5>
            <div>{getStatusBadge(order.status)}</div>
            <p className="mt-2">
              <strong>Ngày tạo:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </Col>
        </Row>
      </Card>

      <h5 className="mb-3">Sản phẩm trong đơn</h5>
      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr
              key={item.productId || index}
              className="align-middle"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <td className="d-flex align-items-center">
                <Image
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="me-2"
                  rounded
                />
                {item.name}
              </td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>{item.quantity}</td>
              <td className="fw-bold text-danger">
                {(item.price * item.quantity).toLocaleString()}₫
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-end mt-3">
        <h4 className="fw-bold">
          Tổng cộng:{" "}
          <span className="text-danger">
            {order.total.toLocaleString()}₫
          </span>
        </h4>
        <Link to="/orders" className="btn btn-secondary mt-3">
          Quay lại lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
