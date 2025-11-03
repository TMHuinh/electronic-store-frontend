import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Alert,
  Form,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye, FaTrash } from "react-icons/fa";
import orderApi from "../../api/orderApi";
import axiosClient from "../../api/axiosClient";

const OrderAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // 🟢 Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrders();
      const data = res.data || res;
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🟣 Lọc theo trạng thái
  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === filterStatus));
    }
  }, [filterStatus, orders]);

  // 🟡 Xem chi tiết
  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // 🟠 Cập nhật trạng thái
  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Xác nhận đổi trạng thái sang "${newStatus}"?`)) return;
    try {
      setStatusUpdating(true);
      await axiosClient.put(`/orders/${orderId}`, { status: newStatus });
      await fetchOrders();
      setShowModal(false);
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật trạng thái!");
    } finally {
      setStatusUpdating(false);
    }
  };

  // 🔴 Xóa đơn hàng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;
    try {
      await axiosClient.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa đơn hàng");
    }
  };

  // 🟣 Hiển thị badge trạng thái
  const statusBadge = (status) => {
    switch (status) {
      case "Processing":
        return <Badge bg="info">Đang xử lý</Badge>;
      case "Shipped":
        return <Badge bg="warning">Đang giao</Badge>;
      case "Delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "Canceled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📦 Quản lý đơn hàng</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* 🟩 Bộ lọc */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Canceled">Đã hủy</option>
          </Form.Select>
        </Col>
        <Col md="auto">
          <Button variant="outline-secondary" onClick={fetchOrders}>
            Làm mới
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light text-center align-middle">
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <tr key={o._id} className="align-middle">
                  <td className="text-center">{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.name || "—"}</td>
                  <td className="text-end">
                    {o.total?.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="text-center">{statusBadge(o.status)}</td>
                  <td className="text-center">
                    {new Date(o.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(o)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(o._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-3">
                  Không có đơn hàng nào trong trạng thái này
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* 🔍 Modal chi tiết đơn hàng */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p><strong>Mã đơn:</strong> {selectedOrder._id}</p>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.user?.name} ({selectedOrder.user?.email})
              </p>
              <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address}</p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {statusBadge(selectedOrder.status)}
              </p>

              <h5 className="mt-4">🛍️ Sản phẩm</h5>
              <Table bordered size="sm" className="mt-2">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || "Sản phẩm đã xóa"}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price?.toLocaleString("vi-VN")} ₫</td>
                      <td>
                        {(item.price * item.quantity)?.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <h5 className="mb-0">
                  Tổng cộng:{" "}
                  <span className="text-danger fw-bold">
                    {selectedOrder.total?.toLocaleString("vi-VN")} ₫
                  </span>
                </h5>

                <Form.Select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  disabled={statusUpdating}
                  style={{ width: "220px" }}
                >
                  <option value="Processing">Đang xử lý</option>
                  <option value="Shipped">Đang giao</option>
                  <option value="Delivered">Đã giao</option>
                  <option value="Canceled">Đã hủy</option>
                </Form.Select>
              </div>
            </>
          ) : (
            <p className="text-center text-muted">Không có dữ liệu</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderAdminPage;
