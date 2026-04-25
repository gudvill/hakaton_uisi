import './Reviews.css';
import { useState, useEffect } from 'react';
import { getReviews } from '../../../../api/reviewsService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getReviews().then(setItems).catch(console.error);
  }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ content: '', image: '' }); };
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

  const EditCard = ({ id }) => (
    <div key={id} className="review-edit-card">
      <input className="section-input" value={form.image || ''} placeholder="URL фотографии"
        onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
      <textarea className="section-textarea" value={form.content || ''} placeholder="Текст отзыва"
        onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
      <div className="section-row-actions" style={{ marginTop: 4 }}>
        <button className="section-save-btn" onClick={save}>сохранить</button>
        <button className="section-cancel-btn" onClick={cancel}>отмена</button>
      </div>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>ОТЗЫВЫ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>
      <div className="reviews-grid">
        {editId === 'new' && <EditCard id="new" />}
        {items.length === 0 && editId !== 'new' && <p className="section-empty">Нет отзывов</p>}
        {items.map(item => editId === item.id ? (
          <EditCard key={item.id} id={item.id} />
        ) : (
          <div key={item.id} className="review-card">
            {item.image && <img className="review-photo" src={item.image} alt="" />}
            <p className="review-content">{item.content}</p>
            <div className="section-row-actions" style={{ marginTop: 'auto', paddingTop: 6 }}>
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
