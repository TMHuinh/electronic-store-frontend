import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import userApi from "../api/userApi";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // ✅ Lấy token riêng và user info riêng
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 🟢 Lấy thông tin user khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          toast.error("Vui lòng đăng nhập!");
          return;
        }
        const res = await userApi.getProfile(token); // ✅ dùng token riêng
        setUser({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          password: "",
        });
      } catch (error) {
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // 🟣 Cập nhật profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await userApi.updateProfile(user, token); // ✅ dùng token riêng
      toast.success("Cập nhật thông tin thành công!");

      // cập nhật localStorage userInfo
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">👤 Thông tin cá nhân</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={user.email} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới (nếu muốn đổi)</Form.Label>
              <Form.Control
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Để trống nếu không đổi mật khẩu"
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="primary" disabled={updating}>
                {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
