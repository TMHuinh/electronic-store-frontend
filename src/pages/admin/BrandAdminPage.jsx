import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import brandApi from "../../api/brandApi";
import axiosClient from "../../api/axiosClient";

const BrandAdminPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    country: "",
  });

  // 🟢 Load danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await brandApi.getAll();
      setBrands(res.data || res);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // 🟡 Mở modal thêm/sửa
  const handleShow = (brand = null) => {
    if (brand) {
      setEditBrand(brand);
      setForm({
        name: brand.name,
        description: brand.description || "",
        country: brand.country || "",
      });
    } else {
      setEditBrand(null);
      setForm({
        name: "",
        description: "",
        country: "",
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // 🟣 Lưu thương hiệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBrand) {
        await axiosClient.put(`/brands/${editBrand._id}`, form);
      } else {
        await axiosClient.post(`/brands`, form);
      }
      handleClose();
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu thương hiệu");
    }
  };

  // 🔴 Xóa thương hiệu
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;
    try {
      await axiosClient.delete(`/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa thương hiệu");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">🏷️ Quản lý thương hiệu</h2>
        <Button variant="success" onClick={() => handleShow()}>
          <FaPlus className="me-2" /> Thêm thương hiệu
        </Button>
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
              <th>Tên thương hiệu</th>
              <th>Quốc gia</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((b) => (
                <tr key={b._id} className="align-middle">
                  <td className="fw-semibold">{b.name}</td>
                  <td>{b.country || "—"}</td>
                  <td>{b.description || "—"}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShow(b)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(b._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted py-3">
                  Chưa có thương hiệu nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal thêm/sửa thương hiệu */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên thương hiệu</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quốc gia</Form.Label>
              <Form.Control
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>

            <div className="text-end mt-3">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {editBrand ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BrandAdminPage;
