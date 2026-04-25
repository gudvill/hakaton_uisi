import './News.css';
import { useState, useEffect } from 'react';
import { getNews } from '../../../../api/newsService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru-RU');
}

export default function News() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getNews().then(setItems).catch(console.error);
  }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ name: '', brief_description: '', image: '' }); };
  const cancel    = () => { setEditId(null); setForm({}); };
  const save = () => {
    if (editId === 'new') {
      setItems(p => [...p, { ...form, id: Date.now(), created_at: new Date().toISOString() }]);
    } else {
      setItems(p => p.map(i => i.id === editId ? { ...i, ...form } : i));
    }
    cancel();
  };
  const del = (id) => setItems(p => p.filter(i => i.id !== id));

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  const EditRow = () => (
    <tr className="section-edit-row">
      <td>{form.image ? <img className="section-thumbnail" src={form.image} alt="" /> : <div className="news-img-placeholder" />}</td>
      <td>{inp('image', 'URL изображения')}</td>
      <td>{inp('name', 'Заголовок')}</td>
      <td>{inp('brief_description', 'Краткое описание')}</td>
      <td>
        <div className="section-row-actions">
          <button className="section-save-btn" onClick={save}>сохранить</button>
          <button className="section-cancel-btn" onClick={cancel}>отмена</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>НОВОСТИ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>

      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Фото</th>
              <th>URL</th>
              <th>Заголовок</th>
              <th>Описание</th>
              <th style={{ width: 100 }}>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editId === 'new' && <EditRow />}
            {items.length === 0 && editId !== 'new' && (
              <tr><td colSpan={6} className="section-empty">Нет новостей</td></tr>
            )}
            {items.map(item => editId === item.id ? (
              <EditRow key={item.id} />
            ) : (
              <tr key={item.id}>
                <td>{item.image && <img className="section-thumbnail" src={item.image} alt="" />}</td>
                <td className="news-url">{item.image || '—'}</td>
                <td className="news-title">{item.name}</td>
                <td className="news-brief">{item.brief_description}</td>
                <td style={{ whiteSpace: 'nowrap', color: '#999' }}>{formatDate(item.created_at)}</td>
                <td>
                  <div className="section-row-actions">
                    <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)}>
                      <PencilIcon style={{ width: 15, height: 15 }} />
                    </button>
                    <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)}>
                      <TrashIcon style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
