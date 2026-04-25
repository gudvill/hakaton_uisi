import './Partners.css';
import { useState, useEffect } from 'react';
import { getPartners } from '../../../../api/partnersService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Partners() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getPartners().then(setItems).catch(console.error);
  }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ name: '', description: '', image: '' }); };
  const cancel    = () => { setEditId(null); setForm({}); };
  const save = () => {
    if (editId === 'new') {
      setItems(p => [...p, { ...form, id: Date.now() }]);
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
      <td style={{ width: 56 }}>
        {form.image
          ? <img className="section-thumbnail partner-logo" src={form.image} alt="" />
          : <div style={{ width: 44, height: 44, background: '#f3f0ff', borderRadius: 8 }} />
        }
      </td>
      <td>{inp('image', 'URL логотипа')}</td>
      <td>{inp('name', 'Название')}</td>
      <td>{inp('description', 'Описание')}</td>
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
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>ПАРТНЁРЫ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>
      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr><th style={{ width: 56 }}>Лого</th><th>URL</th><th>Название</th><th>Описание</th><th></th></tr>
          </thead>
          <tbody>
            {editId === 'new' && <EditRow />}
            {items.length === 0 && editId !== 'new' && (
              <tr><td colSpan={5} className="section-empty">Нет партнёров</td></tr>
            )}
            {items.map(item => editId === item.id ? (
              <EditRow key={item.id} />
            ) : (
              <tr key={item.id}>
                <td>{item.image && <img className="section-thumbnail partner-logo" src={item.image} alt="" />}</td>
                <td style={{ fontSize: 11, color: '#aaa', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.image || '—'}</td>
                <td style={{ fontWeight: 600 }}>{item.name || '—'}</td>
                <td className="partner-desc">{item.description || '—'}</td>
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
