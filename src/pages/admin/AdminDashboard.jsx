import React from "react";
import { Container, Nav, Dropdown } from "react-bootstrap";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingBag,
  FaListAlt,
  FaHome,
  FaCodeBranch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Admin" };

  const menu = [
    { path: "/admin/dashboard", label: "Tổng quan", icon: <FaHome /> },
    { path: "/admin/products", label: "Sản phẩm", icon: <FaBoxOpen /> },
    { path: "/admin/users", label: "Khách hàng", icon: <FaUsers /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <FaShoppingBag /> },
    { path: "/admin/categories", label: "Danh mục", icon: <FaListAlt /> },
    { path: "/admin/brands", label: "Thương hiệu", icon: <FaCodeBranch /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <div className="admin-dashboard d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white d-flex flex-column p-0 shadow">
        <div className="brand p-3 text-center border-bottom border-secondary">
          <h4 className="fw-bold text-primary mb-0">HUINH Admin</h4>
        </div>

        <Nav className="flex-column mt-3">
          {menu.map((item) => (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={`d-flex align-items-center px-4 py-2 sidebar-link ${location.pathname === item.path ? "active" : ""
                }`}
            >
              <span className="me-2 fs-5">{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        <div className="mt-auto text-center py-3 border-top border-secondary small text-secondary">
          © 2025 HUINH Store
        </div>
      </div>

      {/* Main Content */}
      <div className="content flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center shadow-sm bg-white px-4 py-3 border-bottom">
          <h5 className="fw-bold mb-0 text-primary">Bảng điều khiển quản trị</h5>
        </header>

        {/* Page content */}
        <Container fluid className="p-4 overflow-auto flex-grow-1 fade-in">
          <div className="bg-white p-4 rounded-3 shadow-sm">
            <Outlet />
          </div>
        </Container>
      </div>

      {/* CSS */}
      <style>{`
        .sidebar {
          width: 200px;
          transition: width 0.3s ease;
        }

        .sidebar-link {
          color: #adb5bd;
          font-weight: 500;
          border-left: 4px solid transparent;
          transition: all 0.3s ease;
        }

        .sidebar-link:hover {
          color: #fff;
          background-color: #2b3035;
          border-left: 4px solid #0d6efd;
        }

        .sidebar-link.active {
          color: #0d6efd;
          background-color: #212529;
          border-left: 4px solid #0d6efd;
        }

        .fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .sidebar {
            width: 200px;
          }
          .sidebar-link {
            font-size: 0.9rem;
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
