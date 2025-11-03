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
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import brandApi from "../../api/brandApi";
import axiosClient from "../../api/axiosClient";

const ProductAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    images: [],
  });

  // 🟢 Load sản phẩm, danh mục, thương hiệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes, brandRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        brandApi.getAll(),
      ]);

      // Kiểm tra định dạng dữ liệu
      setProducts(productRes.data || productRes);
      setCategories(categoryRes.data || categoryRes);
      setBrands(brandRes.data || brandRes);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🟡 Mở modal thêm hoặc sửa
  const handleShow = (product = null) => {
    if (product) {
      setEditProduct(product);
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category?._id || "",
        brand: product.brand?._id || "",
        images: [],
      });
    } else {
      setEditProduct(null);
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        images: [],
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // 🟠 Upload ảnh
  const handleImageChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  // 🟣 Thêm hoặc cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, value);
        }
      });

      if (editProduct) {
        await axiosClient.put(`/products/${editProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosClient.post(`/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu sản phẩm");
    }
  };

  // 🔴 Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa sản phẩm");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📦 Quản lý sản phẩm</h2>
        <Button variant="success" onClick={() => handleShow()}>
          <FaPlus className="me-2" /> Thêm sản phẩm
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
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="align-middle">
                <td width="100">
                  <img
                    src={
                      p.images?.[0]?.url ||
                      `http://localhost:5000/uploads/${p.images?.[0]}`
                    }
                    alt={p.name}
                    className="img-thumbnail"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </td>
                <td>{p.name}</td>
                <td className="text-end">{p.price.toLocaleString()} ₫</td>
                <td className="text-center">{p.stock}</td>
                <td>{p.category?.name}</td>
                <td>{p.brand?.name}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(p)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tồn kho</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

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

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Select
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
            </Form.Group>

            <div className="text-end mt-4">
              <Button variant="secondary" className="me-2" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {editProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductAdminPage;
