import React, { useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Badge, Spinner } from "react-bootstrap";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  if (!orders.length) {
    return (
      <div className="text-center py-5">
        <h4>🛒 Bạn chưa có đơn hàng nào.</h4>
        <Link to="/" className="btn btn-primary mt-3">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-5 fw-bold text-primary text-center">Lịch sử đơn hàng</h2>
      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>#ID</th>
            <th>Ngày tạo</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="align-middle">{order._id}</td>
              <td className="align-middle">
                {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="align-middle text-danger fw-bold">
                {order.total.toLocaleString()}₫
              </td>
              <td className="align-middle">{getStatusBadge(order.status)}</td>
              <td className="align-middle">
                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-sm btn-primary"
                >
                  Xem chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderHistoryPage;
