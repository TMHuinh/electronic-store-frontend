import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, Button, Spinner, Card, Image } from "react-bootstrap";
import orderApi from "../api/orderApi";
import userApi from "../api/userApi";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return toast.error("Vui lòng đăng nhập!");
        const res = await userApi.getProfile(token);
        setUser({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch {
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 20000;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!user.name || !user.phone || !user.address)
      return toast.error("Vui lòng điền đầy đủ thông tin giao hàng");

    try {
      setPlacingOrder(true);
      await orderApi.createOrder({
        user: JSON.parse(localStorage.getItem("userInfo"))._id,
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        total,
        address: `${user.address} - ${user.name} - ${user.phone}`,
        paymentMethod,
        status: "Processing",
      });

      toast.success("Đặt hàng thành công!");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (!cart?.items?.length)
    return (
      <div className="text-center py-5">
        <h4>🛒 Giỏ hàng của bạn đang trống!</h4>
      </div>
    );

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Left: thông tin giao hàng */}
        <Col md={6}>
          <Card className="p-3">
            <h4 className="mb-3">Thông tin giao hàng</h4>
            <Form>
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
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="MOMO">Ví Momo</option>
                  <option value="BANK">Chuyển khoản ngân hàng</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Card>
        </Col>

        {/* Right: giỏ hàng & tổng */}
        <Col md={6}>
          <Card className="p-3">
            <h4 className="mb-3">Đơn hàng của bạn</h4>
            <div className="mb-3">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="d-flex align-items-center mb-3 border-bottom pb-2"
                >
                  <Image
                    src={item.product.images?.[0]?.url || "/no-image.png"}
                    alt={item.product.name}
                    rounded
                    width={60}
                    height={60}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <strong>{item.product.name}</strong>
                    <div>SL: {item.quantity}</div>
                  </div>
                  <div className="text-end">
                    <div>{item.product.price.toLocaleString()}₫</div>
                    <div className="fw-bold">
                      {(item.product.price * item.quantity).toLocaleString()}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()}₫</span>
            </div>
            <div className="d-flex justify-content-between fw-bold mt-2 fs-5">
              <span>Tổng cộng:</span>
              <span className="text-danger">{total.toLocaleString()}₫</span>
            </div>

            <Button
              className="w-100 mt-3"
              variant="success"
              onClick={handleCheckout}
              disabled={placingOrder}
            >
              {placingOrder ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
