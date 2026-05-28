import './Partners.css';
import { useState, useEffect, useCallback } from 'react';
import { getPartners, getArchivedPartners, createPartner, updatePartner, disablePartner, restorePartner } from '../../../../api/partnersService';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import FileInputButton from '../../FileInputButton';

const SORTABLE_KEYS = ['name', 'description'];

function PartnersEditRow({ form, setForm, file, setFile, apiUrl, onSave, onCancel }) {
  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );
  return (
    <tr className="section-edit-row">
      <td style={{ width: 80 }}>
        {file ? (
          <img className="section-thumbnail partner-logo" src={URL.createObjectURL(file)} alt="" style={{ objectFit: 'contain', background: '#f3f0ff' }} />
        ) : form.image ? (
          <img className="section-thumbnail partner-logo" src={`${apiUrl}${form.image}`} alt="" style={{ objectFit: 'contain', background: '#f3f0ff' }} />
        ) : (
          <div style={{ width: 44, height: 44, background: '#f3f0ff', borderRadius: 8 }} />
        )}
        <FileInputButton onChange={e => setFile(e.target.files[0])} />
      </td>
      <td>{inp('name', 'Название')}</td>
      <td>{inp('description', 'Описание')}</td>
      <td>{inp('site_link', 'Ссылка на сайт')}</td>
      <td>
        <div className="section-row-actions">
          <button type="button" className="section-save-btn" onClick={onSave}>сохранить</button>
          <button type="button" className="section-cancel-btn" onClick={onCancel}>отмена</button>
        </div>
      </td>
    </tr>
  );
}

export default function Partners() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const API_URL = process.env.REACT_APP_API_URL || '';

  const load = useCallback(async () => {
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
  }, [search, sort, tab]);

  useEffect(() => {
    const delay = setTimeout(() => {
      load();
    }, 400);

    return () => clearTimeout(delay);
  }, [load]);

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- только при монтировании
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
    setFile(null);
  };

  const startAdd = () => {
    setEditId('new');
    setForm({ name: '', description: '', site_link: '' });
    setFile(null);
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
    setFile(null);
  };

  const save = async () => {
    const formData = new FormData();
    const allowedKeys = ['name', 'description', 'site_link'];
    allowedKeys.forEach(key => {
      const v = form[key];
      if (v !== '' && v !== null && v !== undefined) {
        formData.append(key, v);
      }
    });

    if (file) {
      formData.append("file", file);
    }

    try {
      if (editId === 'new') {
        await createPartner(formData);
      } else {
        await updatePartner(editId, formData);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    try {
      await disablePartner(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const restore = async (id) => {
    try {
      await restorePartner(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

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
                { key: 'name', label: 'Название' },
                { key: 'description', label: 'Описание' },
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
            {tab === 'active' && editId === 'new' && (
              <PartnersEditRow
                form={form}
                setForm={setForm}
                file={file}
                setFile={setFile}
                apiUrl={API_URL}
                onSave={save}
                onCancel={cancel}
              />
            )}
            {items.length === 0 && editId !== 'new' && (
              <tr>
                <td colSpan={6} className="section-empty">Нет партнёров</td>
              </tr>
            )}
            {items.map(item => editId === item.id ? (
              <PartnersEditRow
                key={item.id}
                form={form}
                setForm={setForm}
                file={file}
                setFile={setFile}
                apiUrl={API_URL}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <tr key={item.id}>
                <td>
                  {item.image && (
                    <img className="section-thumbnail partner-logo" src={`${API_URL}${item.image}`} alt="" />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{item.name || '—'}</td>
                <td className="partner-desc">{item.description || '—'}</td>
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