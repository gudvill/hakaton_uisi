import './login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authService";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(login, password);

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
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Войти</button>
      </form>
    </section>
  );
}
