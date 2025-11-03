import React from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
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
} from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardHome = () => {
  // Dữ liệu thống kê giả
  const stats = [
    { label: "Tổng đơn hàng", value: 1240, icon: <FaShoppingBag />, color: "primary" },
    { label: "Khách hàng", value: 875, icon: <FaUsers />, color: "success" },
    { label: "Sản phẩm", value: 320, icon: <FaBoxOpen />, color: "warning" },
    { label: "Doanh thu (VNĐ)", value: "356,000,000", icon: <FaMoneyBillWave />, color: "danger" },
  ];

  // Dữ liệu biểu đồ
  const chartData = {
    labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"],
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: [25, 40, 35, 50, 70, 65, 90],
        backgroundColor: "rgba(13, 110, 253, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 20 } },
      x: { grid: { display: false } },
    },
  };

  // Dữ liệu đơn hàng gần đây
  const recentOrders = [
    { id: "DH001", customer: "Nguyễn Văn A", total: "1.200.000đ", status: "Đã giao" },
    { id: "DH002", customer: "Trần Thị B", total: "890.000đ", status: "Đang xử lý" },
    { id: "DH003", customer: "Phạm Văn C", total: "2.150.000đ", status: "Đã hủy" },
    { id: "DH004", customer: "Lê Thị D", total: "3.400.000đ", status: "Đang giao" },
  ];

  const statusBadge = (status) => {
    switch (status) {
      case "Đã giao":
        return <Badge bg="success">Đã giao</Badge>;
      case "Đang giao":
        return <Badge bg="info">Đang giao</Badge>;
      case "Đang xử lý":
        return <Badge bg="warning">Đang xử lý</Badge>;
      default:
        return <Badge bg="danger">Đã hủy</Badge>;
    }
  };

  return (
    <div className="dashboard">
      <h3 className="fw-bold text-primary mb-4">Trang tổng quan quản trị</h3>

      {/* Thống kê tổng quan */}
      <Row className="g-3 mb-4">
        {stats.map((item, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card className="shadow-sm border-0 stat-card">
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

      {/* Biểu đồ doanh thu */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-3 text-primary">Thống kê doanh thu (7 tháng gần nhất)</h5>
          <Bar data={chartData} options={chartOptions} height={90} />
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
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>{statusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* CSS */}
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
