import './News.css';
import { useState, useEffect } from 'react';
import { getNews, getArchivedNews, createNews, updateNews, disableNews, restoreNews } from '../../../../api/newsService';
import { PencilIcon, TrashIcon, PlusIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru-RU');
}

export default function News() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('active'); // 'active' | 'archive'
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' });
  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);

  const load = async (silent = false) => {
    try {
      const params = {
        search: search || undefined,
        year: year ? Number(year) : undefined,
        sort_by: sort.key,
        sort_dir: sort.dir,
      };

      const data =
        tab === 'archive'
          ? await getArchivedNews(params)
          : await getNews(params);

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
  }, [tab, search, year, sort]);

  useEffect(() => {
    load();
  }, []);

const toggleSort = (key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const startAdd = () => {
    setEditId('new');
    setForm({
      name: '',
      brief_description: '',
      full_description: '',
      image: ''
    });
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  const save = async () => {
    try {
      if (editId === 'new') {
        await createNews(form);
      } else {
        await updateNews(editId, form);
      }
      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await disableNews(id);
    load();
  };

  const restore = async (id) => {
    await restoreNews(id);
    load();
  };

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder}
    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  const EditRow = () => (
    <tr className="section-edit-row">
      <td>
        {form.image
          ? <img className="section-thumbnail" src={form.image} alt="" />
          : <div className="news-img-placeholder" />
        }
      </td>
      <td>{inp('image', 'Путь к фото')}</td>
      <td>{inp('name', 'Заголовок')}</td>
      <td>{inp('brief_description', 'Краткое описание')}</td>
      <td>{inp('full_description', 'Полное описание')}</td>
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
        {tab === 'active' && (
          <button className="section-add-btn" onClick={startAdd}>
            <PlusIcon style={{ width: 16, height: 16 }} /> добавить
          </button>
        )}
      </div>

      {/* Вкладки */}
      <div className="news-tabs">
        <button className={`news-tab ${tab === 'active' ? 'news-tab--active' : ''}`} onClick={() => { setTab('active'); cancel(); }} >
          Активные
        </button>
        <button className={`news-tab ${tab === 'archive' ? 'news-tab--active' : ''}`} onClick={() => { setTab('archive'); cancel(); }} >
          Архив
        </button>
      </div>
      {/* ===== FILTERS ===== */}
      <div className="participants-filters">
        <input className="participants-search" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="participants-filter-select" value={year} onChange={e => setYear(e.target.value)} >
          <option value="">Год новости</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {(search || year) && (
          <button className="participants-reset-btn"
            onClick={() => {
              setSearch('');
              setYear('');
            }} >сбросить</button>
        )}
      </div>
      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Фото</th>
              <th>Путь к фото</th>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                Заголовок {sort.key === 'name' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th>Краткое описание</th>
              <th>Полное описание</th>
              <th onClick={() => toggleSort('created_at')} style={{ cursor: 'pointer' }}>
                Создана {sort.key === 'created_at' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tab === 'active' && editId === 'new' && <EditRow />}
            {items.length === 0 && editId !== 'new' && (
              <tr>
                <td colSpan={7} className="section-empty">
                  Нет новостей
                </td>
              </tr>
            )}
            {items.map(item =>
              editId === item.id ? (
                <EditRow key={item.id} />
              ) : (
                <tr key={item.id}>
                  <td>
                    {item.image && (
                      <img className="section-thumbnail" src={item.image} alt="" />
                    )}
                  </td>
                  <td className="news-url">{item.image || '—'}</td>
                  <td className="news-title">{item.name}</td>
                  <td className="news-brief">{item.brief_description}</td>
                  <td className="news-brief">{item.full_description}</td>
                  <td style={{ whiteSpace: 'nowrap', color: '#999' }}>
                    {formatDate(item.created_at)}
                  </td>
                  <td>
                    <div className="section-row-actions">
                      {tab === 'active' ? (
                        <>
                          <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)} >
                            <PencilIcon style={{ width: 15, height: 15 }} />
                          </button>
                          <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)} >
                            <TrashIcon style={{ width: 15, height: 15 }} />
                          </button>
                        </>
                      ) : (
                        <button className="section-icon-btn section-icon-btn--edit" title="Восстановить" onClick={() => restore(item.id)} >
                          <ArchiveBoxIcon style={{ width: 15, height: 15 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}