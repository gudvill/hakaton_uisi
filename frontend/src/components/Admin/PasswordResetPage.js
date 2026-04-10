import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Ошибка");
    }
  };

  return (
    <div>
      <h1>Сброс пароля</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          placeholder="Новый пароль"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Сменить пароль</button>
      </form>
      <p>{message}</p>
    </div>
  );
}