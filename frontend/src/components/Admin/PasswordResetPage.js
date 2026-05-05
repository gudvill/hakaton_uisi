import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../api/authService";
import './login.css';

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setMessage("Пароли не совпадают");
      setIsError(true);
      return;
    }
    try {
      const res = await resetPassword(token, newPassword, confirm);
      setMessage(res?.message || "Пароль успешно изменён");
      setIsError(false);
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 2500);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Ошибка. Ссылка недействительна или устарела.");
      setIsError(true);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="login-logo">
        <img src="/images/logo2.svg" alt="logo" style={{ width: 180 }} />
      </Link>

      <div className="login-card">
        <h2 className="login-title">Новый пароль</h2>

        {done ? (
          <div className="login-form">
            <p style={{ textAlign: 'center', color: '#16a34a', fontSize: 14, lineHeight: 1.6 }}>
              {message}<br />Перенаправляем на страницу входа…
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Новый пароль</label>
              <input
                className="login-input"
                type="password"
                value={newPassword}
                placeholder="Введите новый пароль"
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Повторите пароль</label>
              <input
                className="login-input"
                type="password"
                value={confirm}
                placeholder="Повторите пароль"
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            {message && (
              <p style={{ textAlign: 'center', fontSize: 13, color: isError ? '#dc2626' : '#16a34a' }}>
                {message}
              </p>
            )}

            <button className="login-button" type="submit">
              Сменить пароль
            </button>

            <Link to="/admin/login" className="login-restore">
              Вернуться ко входу
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
