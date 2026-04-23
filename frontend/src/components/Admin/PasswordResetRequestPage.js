import { useState } from "react";
import api from "../../api/axios";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/request-password-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Произошла ошибка");
    }
  };

  return (
    <div>
      <h1 style={{ color: white }}>Восстановление пароля</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Введите ваш email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" style={{ color: white }}>Отправить ссылку</button>
      </form>
      <p style={{ color: white }}>{message}</p>
    </div>
  );
}