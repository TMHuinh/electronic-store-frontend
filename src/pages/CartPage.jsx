import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, updateItem, removeItem, clearCart } = useCart();

  if (!cart?.items?.length) {
    return (
      <div className="container py-5 text-center">
        <h4>🛒 Giỏ hàng của bạn đang trống!</h4>
        <Link to="/" className="btn btn-primary mt-3">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-primary">🛒 Giỏ hàng của bạn</h3>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.product._id}>
              <td>
                <img
                  src={item.product.images?.[0]?.url || "/no-image.png"}
                  alt={item.product.name}
                  width="60"
                  className="me-3 rounded"
                />
                {item.product.name}
              </td>
              <td>{item.product.price.toLocaleString()}₫</td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      updateItem(item.product._id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      updateItem(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{(item.product.price * item.quantity).toLocaleString()}₫</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(item.product._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-outline-danger" onClick={clearCart}>
          Xóa toàn bộ giỏ hàng
        </button>
        <h5>
          Tổng cộng: <span className="text-danger">{total.toLocaleString()}₫</span>
        </h5>
      </div>

      <div className="text-end mt-3">
        <Link to="/checkout" className="btn btn-success">
          Thanh toán
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
