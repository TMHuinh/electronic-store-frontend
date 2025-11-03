import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import categoryApi from "../../api/categoryApi";
import axiosClient from "../../api/axiosClient";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // 🟢 Load danh mục
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setCategories(res.data || res);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🟡 Mở modal thêm/sửa
  const handleShow = (category = null) => {
    if (category) {
      setEditCategory(category);
      setForm({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditCategory(null);
      setForm({
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // 🟣 Lưu danh mục
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await axiosClient.put(`/categories/${editCategory._id}`, form);
      } else {
        await axiosClient.post(`/categories`, form);
      }
      handleClose();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu danh mục");
    }
  };

  // 🔴 Xóa danh mục
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa danh mục");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📂 Quản lý danh mục</h2>
        <Button variant="success" onClick={() => handleShow()}>
          <FaPlus className="me-2" /> Thêm danh mục
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr className="text-center align-middle">
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((c) => (
                <tr key={c._id} className="align-middle">
                  <td className="fw-semibold">{c.name}</td>
                  <td>{c.description || "—"}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShow(c)}
                    >
                      <FaEdit />
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
                <td colSpan={3} className="text-center text-muted py-3">
                  Chưa có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal thêm/sửa danh mục */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
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
                {editCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryAdminPage;
