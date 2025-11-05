import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import axiosClient from "../api/axiosClient";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực tài khoản...");
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const res = await axiosClient.get(`/users/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message);
        setTimeout(() => navigate("/login"), 5000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Liên kết không hợp lệ hoặc đã hết hạn."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderIcon = () => {
    if (status === "loading")
      return <FaSpinner className="text-primary mb-3 spin" size={60} />;
    if (status === "success")
      return <FaCheckCircle className="text-success mb-3 bounce" size={60} />;
    if (status === "error")
      return <FaTimesCircle className="text-danger mb-3 pulse" size={60} />;
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "70vh" }}>
      <div
        className={`card shadow-lg border-0 text-center p-4`}
        style={{
          width: "500px",
          borderRadius: "20px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="card-body">
          {renderIcon()}

          <h3
            className={`fw-bold mb-3 ${
              status === "success"
                ? "text-success"
                : status === "error"
                ? "text-danger"
                : "text-secondary"
            }`}
          >
            {status === "loading" && "🔄 Đang xử lý..."}
            {status === "success" && "✅ Xác thực thành công!"}
            {status === "error" && "❌ Xác thực thất bại"}
          </h3>

          <p className="text-muted">{message}</p>

          {status === "success" && (
            <p className="mt-2 text-secondary small">
              Hệ thống sẽ tự động chuyển sang trang đăng nhập sau 5 giây...
            </p>
          )}
        </div>
      </div>

      {/* CSS animation inline */}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bounce {
          animation: bounce 0.8s ease infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }

        .pulse {
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VerifyPage;
