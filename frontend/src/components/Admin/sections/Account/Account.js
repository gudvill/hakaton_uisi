import './Account.css';
import { useState, useEffect } from 'react';
import { requestPasswordReset, updateProfile } from '../../../../api/authService';

export default function Account({ admin }) {
  const [form, setForm] = useState({ email: '', login: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (admin) {
      setForm({
        email: admin.email || '',
        login: admin.login || ''
      });
    }
  }, [admin]);

  const save = async () => {
    try {
      await updateProfile(form);
      setMessage('Сохранено');
    } catch (e) {
      setMessage('Ошибка');
    }
  };

  const changePassword = async () => {
    try {
      await requestPasswordReset(form.email);
      setMessage('Ссылка отправлена на почту');
    } catch (e) {
      setMessage('Ошибка отправки');
    }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ИНФОРМАЦИЯ ОБ АККАУНТЕ</h3>
      <div className="admin-form">
        <div className="admin-field">
          <label>Почта</label>
          <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="admin-field">
          <label>Логин</label>
          <input value={form.login} onChange={e => setForm(p => ({ ...p, login: e.target.value }))} />
        </div>
        <button className="admin-save-btn" onClick={save}>сохранить</button>
        <button className="admin-save-btn" style={{ marginTop: 10, background: '#eee', color: '#333' }} onClick={changePassword} >сменить пароль</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}