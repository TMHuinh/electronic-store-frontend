import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import userApi from "../../api/userApi";
import orderApi from "../../api/orderApi";
import productApi from "../../api/productApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    growthPercent: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          userApi.getAll(),
          orderApi.getOrders(),
          productApi.getAll(),
        ]);

        const users = usersRes.data || [];
        const orders = ordersRes.data || [];
        const products = productsRes.data || [];

        const deliveredOrders = orders.filter((o) => o.status === "Delivered");

        const totalRevenue = deliveredOrders.reduce(
          (sum, o) => sum + (o.total || 0),
          0
        );

        // 📊 Doanh thu theo tháng
        const months = Array.from({ length: 12 }, (_, i) => `Th${i + 1}`);
        const revenueByMonth = Array(12).fill(0);
        const currentMonth = new Date().getMonth();

        deliveredOrders.forEach((order) => {
          if (order.createdAt) {
            const m = new Date(order.createdAt).getMonth();
            revenueByMonth[m] += order.total || 0;
          }
        });

        const currentRevenue = revenueByMonth[currentMonth];
        const prevRevenue =
          currentMonth === 0 ? 0 : revenueByMonth[currentMonth - 1];

        let growthPercent = 0;
        if (prevRevenue > 0) {
          growthPercent = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        }

        // 🧩 Thống kê riêng cho tháng hiện tại
        const monthOrders = deliveredOrders.filter(
          (o) => new Date(o.createdAt).getMonth() === currentMonth
        );

        const orderCount = monthOrders.length;
        const avgOrderValue =
          orderCount > 0
            ? currentRevenue / orderCount
            : 0;

        // 🥇 Tìm sản phẩm bán chạy nhất trong tháng này
        const productSales = {};
        monthOrders.forEach((order) => {
          order.items?.forEach((item) => {
            const id = item.product?._id || item.product;
            if (!id) return;
            productSales[id] = (productSales[id] || 0) + item.quantity;
          });
        });

        let bestProduct = "—";
        if (Object.keys(productSales).length > 0) {
          const topId = Object.keys(productSales).sort(
            (a, b) => productSales[b] - productSales[a]
          )[0];
          const found = products.find((p) => p._id === topId);
          bestProduct = found ? found.name : "Không xác định";
        }

        // 🧾 Đơn hàng gần đây
        const latestOrders = [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setStats({
          totalUsers: users.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          monthRevenue: currentRevenue,
          growthPercent,
          orderCount,
          avgOrderValue,
          bestProduct,
        });

        setRecentOrders(latestOrders);

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Doanh thu (triệu VNĐ)",
              data: revenueByMonth.map((v) => v / 1_000_000),
              backgroundColor: "rgba(13, 110, 253, 0.7)",
              borderRadius: 6,
            },
          ],
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <Badge bg="success">Đã giao</Badge>;
      case "Shipped":
        return <Badge bg="info">Đang giao</Badge>;
      case "Processing":
        return <Badge bg="warning">Đang xử lý</Badge>;
      default:
        return <Badge bg="danger">Đã hủy</Badge>;
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  const summaryCards = [
    {
      label: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: <FaShoppingBag />,
      color: "primary",
    },
    {
      label: "Khách hàng",
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: "success",
    },
    {
      label: "Sản phẩm",
      value: stats.totalProducts,
      icon: <FaBoxOpen />,
      color: "warning",
    },
    {
      label: "Doanh thu (VNĐ)",
      value: stats.totalRevenue.toLocaleString("vi-VN") + " ₫",
      icon: <FaMoneyBillWave />,
      color: "danger",
    },
  ];

  return (
    <div className="dashboard">
      <h2 className="fw-bold text-primary mb-4">Trang tổng quan quản trị</h2>

      {/* 3 card thống kê nhỏ */}
      <Row className="g-3 mb-4">
        {summaryCards.map((item, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card className="shadow-sm border-0 stat-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  className={`icon-circle bg-${item.color}-subtle text-${item.color} me-3`}
                >
                  {item.icon}
                </div>
                <div>
                  <h6 className="text-secondary mb-1">{item.label}</h6>
                  <h4 className="fw-bold">{item.value}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Biểu đồ doanh thu 12 tháng */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-3 text-primary">Doanh thu 12 tháng gần nhất</h5>
          <Bar data={chartData} options={{ responsive: true }} height={100} />
        </Card.Body>
      </Card>

      {/* Card doanh thu nổi bật */}
      <Card className="shadow-lg border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            {/* Cột bên trái: Doanh thu tháng */}
            <Col md={5} className="mb-3 mb-md-0">
              <h3 className="text-secondary mb-1">
                Doanh thu tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
              </h3>
              <h2 className="fw-bold text-dark mb-2">
                {stats.monthRevenue.toLocaleString("vi-VN")} ₫
              </h2>

              <div
                className={`fw-semibold mt-2 d-flex align-items-center ${stats.growthPercent >= 0 ? "text-success" : "text-danger"
                  }`}
              >
                {stats.growthPercent >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                <span className="ms-1">
                  {Math.abs(stats.growthPercent).toFixed(1)}%
                </span>
                <span className="text-secondary ms-2">so với tháng trước</span>
              </div>
            </Col>

            {/* Cột bên phải: Tổng quan tháng */}
            <Col md={7}>
              <div className="bg-light rounded-4 p-3 h-100 shadow-sm">
                <h3 className="text-muted mb-3 d-flex align-items-center">
                  Tổng quan tháng này
                </h3>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <FaShoppingBag className="text-primary me-2" />
                    <span>Đơn hàng</span>
                  </div>
                  <span className="fw-bold">{stats.orderCount}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <FaMoneyBillWave className="text-success me-2" />
                    <span>Giá trị TB / đơn</span>
                  </div>
                  <span className="fw-bold">
                    {(stats.avgOrderValue || 0).toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FaBoxOpen className="text-warning me-2" />
                    <span>Sản phẩm bán chạy</span>
                  </div>
                  <span
                    className="fw-bold text-truncate text-end"
                    style={{ maxWidth: "300px" }}
                    title={stats.bestProduct}
                  >
                    {stats.bestProduct || "—"}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>


      {/* Đơn hàng gần đây */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3 text-primary">Đơn hàng gần đây</h5>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || "Khách lẻ"}</td>
                  <td>{order.total?.toLocaleString("vi-VN")} ₫</td>
                  <td>{statusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <style>{`
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
