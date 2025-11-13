import React, { useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Badge, Spinner, Button, ButtonGroup, Pagination } from "react-bootstrap";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
        setFilteredOrders(sorted);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Hàm lọc đơn hàng theo trạng thái
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status.toLowerCase() === status)
      );
    }
  };

  // Badge trạng thái
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

  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      {/* Bộ lọc trạng thái */}
      <div className="row d-flex justify-content-center mb-4">
        <ButtonGroup>
          <Button
            variant={statusFilter === "all" ? "primary" : "outline-primary"}
            onClick={() => handleFilterChange("all")}
          >
            Tất cả
          </Button>
          <Button
            variant={statusFilter === "processing" ? "primary" : "outline-primary"}
            onClick={() => handleFilterChange("processing")}
          >
            Đang xử lý
          </Button>
          <Button
            variant={statusFilter === "shipped" ? "primary" : "outline-primary"}
            onClick={() => handleFilterChange("shipped")}
          >
            Đang giao
          </Button>
          <Button
            variant={statusFilter === "delivered" ? "primary" : "outline-primary"}
            onClick={() => handleFilterChange("delivered")}
          >
            Đã giao
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "primary" : "outline-primary"}
            onClick={() => handleFilterChange("cancelled")}
          >
            Đã hủy
          </Button>
        </ButtonGroup>
      </div>

      {/* Desktop / tablet: table */}
      <div className="d-none d-md-block">
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
            {currentOrders.map((order) => (
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
                <td className="align-middle text-center">
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

      {/* Mobile: stacked order cards */}
      <div className="d-md-none">
        {currentOrders.map((order) => (
          <div key={order._id} className="cart-mobile-card">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">Mã đơn: {order._id}</div>
                <div className="text-muted small">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold text-danger">{order.total.toLocaleString()}₫</div>
                <div className="mt-1">{getStatusBadge(order.status)}</div>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <Link to={`/orders/${order._id}`} className="btn btn-sm btn-primary">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
