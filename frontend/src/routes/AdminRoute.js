/*import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("access");
  if (!token) {
    return <Navigate to="/admin/login" />;
  }
  return children;
}*/
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../api/authService";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    getMe()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Загрузка...</div>;
  if (!isAuth) { return <Navigate to="/admin/login" replace />; }
  return children;
}