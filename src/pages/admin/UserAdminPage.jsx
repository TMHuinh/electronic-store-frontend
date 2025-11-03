import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaTrash, FaEye } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";

const CustomerAdminPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 🟢 Lấy danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/users"); // endpoint backend của bạn
      setCustomers(res.data || res);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🟡 Xem chi tiết khách hàng
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // 🔴 Xóa khách hàng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) return;
    try {
      await axiosClient.delete(`/users/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa khách hàng");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">👥 Quản lý khách hàng</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light text-center align-middle">
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c._id} className="align-middle">
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="text-center">
                    {c.isVerified ? (
                      <span className="badge bg-success">Đã xác thực</span>
                    ) : (
                      <span className="badge bg-secondary">Chưa xác thực</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(c)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(c._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-3">
                  Chưa có khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal xem chi tiết khách hàng */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết khách hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedCustomer ? (
            <>
              <p>
                <strong>Tên:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedCustomer.phone || "—"}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedCustomer.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {selectedCustomer.isVerified ? (
                  <span className="text-success fw-semibold">Đã xác thực</span>
                ) : (
                  <span className="text-muted">Chưa xác thực</span>
                )}
              </p>
              {selectedCustomer.address && (
                <p>
                  <strong>Địa chỉ:</strong> {selectedCustomer.address}
                </p>
              )}
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

export default CustomerAdminPage;
