import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Account() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: 'admin@mail.ru', login: 'admin', password: '' });

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ИНФОРМАЦИЯ ОБ АККАУНТЕ</h3>
      <div className="admin-form">
        <div className="admin-field">
          <label>Почта</label>
          <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="admin-field">
          <label>Логин</label>
          <input type="text" value={form.login} onChange={e => setForm(p => ({ ...p, login: e.target.value }))} />
        </div>
        <div className="admin-field">
          <label>Пароль</label>
          <div className="admin-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Новый пароль"
            />
            <button className="admin-eye" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button className="admin-save-btn">изменить</button>
      </div>
    </div>
  );
}
