import './Program.css';
import { useState, useEffect } from 'react';
import { getProgram, createProgram, updateProgram, deleteProgram } from '../../../../api/programService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function formatDateRange(start, end) {
  if (!start) return '—';
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
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

  const load = () => {
    getProgram().then(setItems).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd = () => {
    setEditId('new');
    setForm({ text: '', start_date: '', end_date: '', order_index: 0 });
  };

  const cancel = () => { setEditId(null); setForm({}); };

  const normalize = (data) => ({
    ...data,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    order_index: data.order_index !== '' ? Number(data.order_index) : null,
  });

  const save = async () => {
    try {
      const payload = normalize(form);

      if (editId === 'new') {
        await createProgram(payload);
      } else {
        await updateProgram(editId, payload);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await deleteProgram(id);
    load();
  };

  const EditCard = () => (
    <div className="program-edit-card">
      <div className="program-edit-dates">
        <div>
          <label>Дата начала</label>
          <input className="section-input" type="date" value={form.start_date || ''} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
        </div>
        <div>
          <label>Дата конца</label>
          <input className="section-input" type="date" value={form.end_date || ''} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
        </div>
      </div>
      <label>Порядок отображения</label>
      <input className="section-input" type="number" value={form.order_index ?? ''} onChange={e => setForm(p => ({ ...p, order_index: e.target.value }))} />
      <textarea className="section-textarea" value={form.text || ''} placeholder="Описание события" onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
      <div className="section-row-actions" style={{ marginTop: 4 }}>
        <button className="section-save-btn" onClick={save}>сохранить</button>
        <button className="section-cancel-btn" onClick={cancel}>отмена</button>
      </div>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>
          ПРОГРАММА
        </h3>

        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>

      <div className="program-list">
        {editId === 'new' && <EditCard />}
        {items.length === 0 && editId !== 'new' && (
          <p className="section-empty">Нет событий</p>
        )}

        {items.map(item =>
          editId === item.id ? (
            <EditCard key={item.id} />
          ) : (
            <div key={item.id} className="program-card">
              <span className="program-date-badge">
                {formatDateRange(item.start_date, item.end_date)}
              </span>
              <span className="program-order">#{item.order_index}</span>
              <p className="program-text">{item.text}</p>
              <div className="section-row-actions">
                <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)} >
                  <PencilIcon style={{ width: 15, height: 15 }} />
                </button>
                <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)} >
                  <TrashIcon style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}