import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("access");
  if (!token) {
    return <Navigate to="/admin/login" />;
  }
  return children;
}