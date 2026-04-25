import './Program.css';
import { useState, useEffect } from 'react';
import { getProgram } from '../../../../api/programService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function formatDateRange(start, end) {
  if (!start) return '—';
  const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const sStr = `${s.getDate()} ${months[s.getMonth()]}`;
  if (!e) return sStr;
  return s.getMonth() === e.getMonth()
    ? `${s.getDate()}–${e.getDate()} ${months[s.getMonth()]}`
    : `${sStr} – ${e.getDate()} ${months[e.getMonth()]}`;
}

export default function Program() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getProgram().then(setItems).catch(console.error);
  }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ text: '', start_date: '', end_date: '' }); };
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

  const EditCard = () => (
    <div className="program-edit-card">
      <div className="program-edit-dates">
        <input className="section-input" type="date" value={form.start_date || ''}
          onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
        <input className="section-input" type="date" value={form.end_date || ''}
          onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
      </div>
      <textarea className="section-textarea" value={form.text || ''} placeholder="Описание события"
        onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
      <div className="section-row-actions" style={{ marginTop: 4 }}>
        <button className="section-save-btn" onClick={save}>сохранить</button>
        <button className="section-cancel-btn" onClick={cancel}>отмена</button>
      </div>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>ПРОГРАММА</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>
      <div className="program-list">
        {editId === 'new' && <EditCard />}
        {items.length === 0 && editId !== 'new' && <p className="section-empty">Нет событий</p>}
        {items.map(item => editId === item.id ? (
          <EditCard key={item.id} />
        ) : (
          <div key={item.id} className="program-card">
            <span className="program-date-badge">{formatDateRange(item.start_date, item.end_date)}</span>
            <p className="program-text">{item.text}</p>
            <div className="section-row-actions">
              <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)}>
                <PencilIcon style={{ width: 15, height: 15 }} />
              </button>
              <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)}>
                <TrashIcon style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
