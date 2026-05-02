import './Partners.css';
import { useState, useEffect } from 'react';
import { getPartners, getArchivedPartners, createPartner, updatePartner, disablePartner, restorePartner } from '../../../../api/partnersService';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const SORTABLE_KEYS = ['name', 'description', 'full_description'];

export default function Partners() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  const load = async (silent = false) => {
    try {
      const params = {
        search: search || undefined,
        sort_by: sort.key,
        sort_dir: sort.dir,
      };

      const data =
        tab === 'archive'
          ? await getArchivedPartners(params)
          : await getPartners(params);

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
  }, [search, sort, tab]);

  useEffect(() => {
    load();
  }, []);

  const toggleSort = (key) => {
    if (!SORTABLE_KEYS.includes(key)) return;
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
      description: '', 
      full_description: '', 
      site_link: '', 
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
        await createPartner(form);
      } else {
        await updatePartner(editId, form);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await disablePartner(id);
    load();
  };

  const restore = async (id) => {
    await restorePartner(id);
    load();
  };

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
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
      <td>{inp('full_description', 'Полное описание')}</td>
      <td>{inp('site_link', 'Ссылка на сайт')}</td>
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
        <span className="count-items">
          {tab === 'active' ? items.length : items.length} партнёров
        </span>
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
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" />
          <input className="participants-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по партнёру..." />
          {search && (
            <button className="participants-search-clear" onClick={() => setSearch('')}>
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      </div>
      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Лого</th>
              {[
                { key: 'image', label: 'Путь к фото' },
                { key: 'name', label: 'Название' },
                { key: 'description', label: 'Описание' },
                { key: 'full_description', label: 'Полное описание' },
                { key: 'site_link', label: 'Ссылка на сайт' },
              ].map(({ key, label }) => (
                <th key={key} className={SORTABLE_KEYS.includes(key) ? "participants-th-sort" : ""} onClick={() => SORTABLE_KEYS.includes(key) && toggleSort(key)} >
                  {label}
                  {SORTABLE_KEYS.includes(key) && (
                    <span className="participants-sort-icon">
                      {sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  )}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tab === 'active' && editId === 'new' && <EditRow />}
            {items.length === 0 && editId !== 'new' && (
              <tr>
                <td colSpan={7} className="section-empty">Нет партнёров</td>
              </tr>
            )}
            {items.map(item => editId === item.id ? (
              <EditRow key={item.id} />
            ) : (
              <tr key={item.id}>
                <td>
                  {item.image && (
                    <img className="section-thumbnail partner-logo" src={item.image} alt="" />
                  )}
                </td>
                <td style={{ fontSize: 11, color: '#aaa', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.image || '—'}
                </td>
                <td style={{ fontWeight: 600 }}>{item.name || '—'}</td>
                <td className="partner-desc">{item.description || '—'}</td>
                <td className="partner-desc">{item.full_description || '—'}</td>
                <td style={{ color: '#666' }}>{item.site_link || '—'}</td>
                <td>
                  <div className="section-row-actions">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}