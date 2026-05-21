import './login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authService";

export default function Login() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(loginValue, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-page">
      <div className="login-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src='/images/logo2.svg' alt="logo" />
      </div>

      <div className="login-card">
        <h2 className="login-title">Вход в админ-панель</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Логин</label>
            <input
              className="login-input"
              type="text"
              placeholder="admin"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Пароль</label>
            <input
              className="login-input"
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" type="submit">ВОЙТИ</button>

          <a href="#" className="login-restore">восстановить пароль</a>
        </form>
      </div>
    </div>
  );
}
