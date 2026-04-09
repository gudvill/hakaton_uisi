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

      // редирект
      navigate("/admin");

    } catch (err) {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <section className='login'>
      <h2>ВХОД</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Войти</button>
        <p
          style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          onClick={() => navigate("/request-password-reset")}
        >
          Забыли пароль?
        </p>
      </form>
    </section>
  );
}
