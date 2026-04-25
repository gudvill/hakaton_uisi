import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import './login.css';

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/request-password-reset", { email });
      setMessage(res.data.message || "Ссылка отправлена на почту");
      setIsError(false);
      setSent(true);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Произошла ошибка");
      setIsError(true);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="login-logo">
        <img src="/images/logo2.svg" alt="logo" style={{ width: 180 }} />
      </Link>

      <div className="login-card">
        <h2 className="login-title">Восстановление пароля</h2>

        {sent ? (
          <div className="login-form">
            <p style={{ textAlign: 'center', color: '#16a34a', fontSize: 14, lineHeight: 1.6 }}>
              {message}
            </p>
            <Link to="/admin/login" className="login-button" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Войти
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                value={email}
                placeholder="Введите ваш email"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p style={{ textAlign: 'center', fontSize: 13, color: isError ? '#dc2626' : '#16a34a' }}>
                {message}
              </p>
            )}

            <button className="login-button" type="submit">
              Отправить ссылку
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
