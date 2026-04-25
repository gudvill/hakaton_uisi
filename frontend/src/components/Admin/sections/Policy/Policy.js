import './Policy.css';
import { useState, useEffect } from 'react';
import { getAcquaintanceByTitle } from '../../../../api/acquaintanceService';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function Policy() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    getAcquaintanceByTitle('Политика конфиденциальности')
      .then(d => { setData(d); setForm(d); })
      .catch(console.error);
  }, []);

  const save   = () => { setData(form); setEditing(false); };
  const cancel = () => { setForm(data); setEditing(false); };

  if (!data) return <p style={{ color: '#999', fontSize: 14 }}>Загрузка...</p>;

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h3>
        {!editing ? (
          <button className="section-add-btn" onClick={() => setEditing(true)}>
            <PencilIcon style={{ width: 15, height: 15 }} /> редактировать
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="section-save-btn" onClick={save}>сохранить</button>
            <button className="section-cancel-btn" onClick={cancel}>отмена</button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="policy-edit-form">
          <input className="section-input" value={form.title || ''} placeholder="Заголовок"
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <textarea className="section-textarea policy-textarea" value={form.text || ''} placeholder="HTML-содержимое"
            onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
        </div>
      ) : (
        <div>
          <p className="policy-preview-title">{data.title}</p>
          <div className="policy-preview-text" dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
      )}
    </div>
  );
}
