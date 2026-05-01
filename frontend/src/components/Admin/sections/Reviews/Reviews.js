import './Reviews.css';
import { useState, useEffect } from 'react';
import { getReviews, getArchivedReviews, createReviews, updateReviews, disableReview, restoreReview } from '../../../../api/reviewsService';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('ru-RU');
}

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('active');
  const [year, setYear] = useState('');
  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);

  const load = async (silent = false) => {
    try {
      const params = {
        year: year ? Number(year) : undefined,
      };

      const data =
        tab === 'archive'
          ? await getArchivedReviews(params)
          : await getReviews(params);

      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      load(true);
    }, 400);

    return () => clearTimeout(delay);
  }, [year, tab]);

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const startAdd = () => {
    setEditId('new');
    setForm({ name: '', content: '', image: '' });
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  const save = async () => {
    try {
      if (editId === 'new') {
        await createReviews(form);
      } else {
        await updateReviews(editId, form);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await disableReview(id);
    load();
  };

  const restore = async (id) => {
    await restoreReview(id);
    load();
  };

  const EditCard = ({ id }) => (
    <div key={id} className="review-edit-card">
      <input className="section-input" value={form.name || ''} placeholder="Название отзыва"
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
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
        {tab === 'active' && (
          <button className="section-add-btn" onClick={startAdd}>
            <PlusIcon style={{ width: 16, height: 16 }} /> добавить
          </button>
        )}
      </div>
      <div className="news-tabs">
        <button className={`news-tab ${tab === 'active' ? 'news-tab--active' : ''}`} onClick={() => { setTab('active'); cancel(); }} >
          Активные
        </button>
        <button className={`news-tab ${tab === 'archive' ? 'news-tab--active' : ''}`} onClick={() => { setTab('archive'); cancel(); }} >
          Архив
        </button>
      </div>
      <div className="participants-filters">
        <select className="participants-filter-select" value={year} onChange={e => setYear(e.target.value)} >
          <option value="">Год отзыва</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {year && (
          <button className="participants-reset-btn" onClick={() => setYear('')} >
            <XMarkIcon style={{ width: 14, height: 14 }} /> сбросить
          </button>
        )}
      </div>
      <div className="reviews-grid">
        {tab === 'active' && editId === 'new' && <EditCard id="new" />}
        {items.length === 0 && editId !== 'new' && (
          <p className="section-empty">Нет отзывов</p>
        )}
        {items.map(item => editId === item.id ? (
          <EditCard key={item.id} id={item.id} />
        ) : (
          <div key={item.id} className="review-card">
            {item.image && (
              <img className="review-photo" src={item.image} alt="" />
            )}
            <p style={{ fontWeight: 600 }}>{item.name || '—'}</p>
            <p className="review-content">{item.content}</p>
            <p style={{ fontSize: 12, color: '#999' }}>Создан: {formatDate(item.created_at)}</p>
            <div className="section-row-actions" style={{ marginTop: 'auto', paddingTop: 6 }}>
              {tab === 'active' ? (
                <>
                  <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)}>
                    <PencilIcon style={{ width: 15, height: 15 }} />
                  </button>
                  <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)}>
                    <TrashIcon style={{ width: 15, height: 15 }} />
                  </button>
                </>
              ) : (
                <button className="section-icon-btn section-icon-btn--edit" title="Восстановить" onClick={() => restore(item.id)} >
                  <ArchiveBoxIcon style={{ width: 15, height: 15 }} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}