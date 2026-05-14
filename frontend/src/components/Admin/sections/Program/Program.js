import './Program.css';
import { useState, useEffect, useMemo } from 'react';
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

function ProgramEditCard({ form, setForm, onSave, onCancel }) {
  return (
    <div className="admin-program-form">
      <div className="admin-program-dates">
        <div className="admin-program-field">
          <label className="admin-program-label" htmlFor="program-start-date">Дата начала</label>
          <input id="program-start-date" className="section-input" type="date" value={form.start_date || ''} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
        </div>
        <div className="admin-program-field">
          <label className="admin-program-label" htmlFor="program-end-date">Дата окончания</label>
          <input id="program-end-date" className="section-input" type="date" value={form.end_date || ''} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
        </div>
      </div>
      <div className="admin-program-field admin-program-order-field">
        <label className="admin-program-label" htmlFor="program-order-index">Порядок в списке</label>
        <input id="program-order-index" className="section-input" type="number" value={form.order_index ?? ''} onChange={e => setForm(p => ({ ...p, order_index: e.target.value }))} />
      </div>
      <div className="admin-program-field">
        <label className="admin-program-label" htmlFor="program-event-text">Текст события</label>
        <textarea id="program-event-text" className="section-textarea" value={form.text || ''} placeholder="Описание для сайта" onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
      </div>
      <div className="section-row-actions">
        <button type="button" className="section-save-btn" onClick={onSave}>сохранить</button>
        <button type="button" className="section-cancel-btn" onClick={onCancel}>отмена</button>
      </div>
    </div>
  );
}

export default function Program() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const load = () => {
    getProgram()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (Number(a.order_index) || 0) - (Number(b.order_index) || 0)),
    [items]
  );

  const showTableHead = items.length > 0 || editId === 'new';

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

  return (
    <div className="admin-card admin-program-section">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>
          ПРОГРАММА
        </h3>

        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>

      <div className="admin-program-list">
        {showTableHead && (
          <div className="admin-program-thead" role="row">
            <span>Период</span>
            <span>Порядок</span>
            <span>Событие</span>
            <span className="admin-program-thead-actions" aria-hidden="true" />
          </div>
        )}
        {editId === 'new' && (
          <div className="admin-program-form-wrap">
            <ProgramEditCard form={form} setForm={setForm} onSave={save} onCancel={cancel} />
          </div>
        )}
        {items.length === 0 && editId !== 'new' && (
          <p className="section-empty">Нет событий</p>
        )}

        {sortedItems.map(item =>
          editId === item.id ? (
            <div key={item.id} className="admin-program-form-wrap">
              <ProgramEditCard form={form} setForm={setForm} onSave={save} onCancel={cancel} />
            </div>
          ) : (
            <div key={item.id} className="admin-program-row">
              <span className="admin-program-date">
                {formatDateRange(item.start_date, item.end_date)}
              </span>
              <span className="admin-program-order">#{item.order_index}</span>
              <p className="admin-program-desc">{item.text}</p>
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