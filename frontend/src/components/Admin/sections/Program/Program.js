import './Program.css';
import { useState, useEffect } from 'react';
import { getProgram, createProgram, updateProgram, deleteProgram } from '../../../../api/programService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function formatDateRange(start, end) {
  if (!start) return '—';
  const months = ['января','февраля','марта','апреля','мая','июня', 'июля','августа','сентября','октября','ноября','декабря'];
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
  const startAdd  = () => {
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
      <label>Дата начала</label>
      <input
        type="date"
        value={form.start_date || ''}
        onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
      />

      <label>Дата конца</label>
      <input
        type="date"
        value={form.end_date || ''}
        onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
      />

      <label>Порядок</label>
      <input
        type="number"
        value={form.order_index ?? 0}
        onChange={e => setForm(p => ({ ...p, order_index: Number(e.target.value) }))}
      />

      <textarea
        value={form.text || ''}
        placeholder="Описание события"
        onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
      />

      <button onClick={save}>сохранить</button>
      <button onClick={cancel}>отмена</button>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3>ПРОГРАММА</h3>
        <button onClick={startAdd}>
          <PlusIcon style={{ width: 16 }} /> добавить
        </button>
      </div>

      <div className="program-list">
        {editId === 'new' && <EditCard />}

        {items.map(item =>
          editId === item.id ? (
            <EditCard key={item.id} />
          ) : (
            <div key={item.id} className="program-card">
              <span>{formatDateRange(item.start_date, item.end_date)}</span>
              <span>#{item.order_index}</span>
              <p>{item.text}</p>

              <button onClick={() => startEdit(item)}>
                <PencilIcon style={{ width: 15 }} />
              </button>
              <button onClick={() => del(item.id)}>
                <TrashIcon style={{ width: 15 }} />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}