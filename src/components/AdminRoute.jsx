import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AdminRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (!userInfo) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập!",
        text: "Bạn cần đăng nhập để truy cập trang quản trị.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "center",
      });
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } else if (!userInfo.isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Truy cập bị từ chối!",
        text: "Tài khoản của bạn không có quyền truy cập khu vực quản trị.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "center",
      });
      setTimeout(() => navigate("/", { replace: true }), 3000);
    }
  }, [navigate]);

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  if (!userInfo || !userInfo.isAdmin) {
    return null; 
  }

  return <Outlet />;
};

export default AdminRoute;
