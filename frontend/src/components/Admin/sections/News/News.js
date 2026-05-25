import './News.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminYearOptions } from '../../yearRange';
import { getNews, getArchivedNews, createNews, updateNews, disableNews, restoreNews } from '../../../../api/newsService';
import { PencilIcon, TrashIcon, PlusIcon, ArchiveBoxIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminSelect from '../../AdminSelect';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru-RU');
}

function NewsEditRow({ form, setForm, file, setFile, apiUrl, onSave, onCancel }) {
  return (
    <tr className="section-edit-row">
      <td className="news-col-photo">
        <div className="news-edit-photo-cell">
          {file ? (
            <img className="section-thumbnail" src={URL.createObjectURL(file)} alt="" style={{ objectFit: 'cover', background: '#f3f0ff' }} />
          ) : form.image ? (
            <img className="section-thumbnail" src={`${apiUrl}${form.image}`} alt="" style={{ objectFit: 'cover', background: '#f3f0ff' }} />
          ) : (
            <div className="news-img-placeholder" />
          )}
          <input type="file" className="news-edit-file-input" onChange={e => setFile(e.target.files[0])} />
        </div>
      </td>
      <td className="news-col-title">
        <textarea
          className="section-textarea news-edit-textarea news-edit-textarea--title"
          value={form.name || ''}
          placeholder="Заголовок"
          rows={2}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        />
      </td>
      <td className="news-col-brief">
        <textarea
          className="section-textarea news-edit-textarea news-edit-textarea--brief"
          value={form.brief_description || ''}
          placeholder="Краткое описание"
          onChange={e => setForm(p => ({ ...p, brief_description: e.target.value }))}
        />
      </td>
      <td className="news-col-full">
        <textarea
          className="section-textarea news-edit-textarea news-edit-textarea--full"
          value={form.full_description || ''}
          placeholder="Полное описание"
          onChange={e => setForm(p => ({ ...p, full_description: e.target.value }))}
        />
      </td>
      <td className="news-col-actions" colSpan={2} style={{ verticalAlign: 'top' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <button type="button" className="section-save-btn" onClick={onSave}>сохранить</button>
          <button type="button" className="section-cancel-btn" onClick={onCancel}>отмена</button>
        </div>
      </td>
    </tr>
  );
}

export default function News() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [tab, setTab] = useState('active'); // 'active' | 'archive'
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' });
  const years = useMemo(() => getAdminYearOptions(), []);
  const API_URL = process.env.REACT_APP_API_URL || '';

  const load = useCallback(async () => {
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
  }, [tab, search, year, sort]);

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
    setForm({ name: '', brief_description: '', full_description: '' });
    setFile(null);
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
    setFile(null);
  };

  const save = async () => {
    const formData = new FormData();
    Object.keys(form).forEach(k => {
      const v = form[k];
      if (v !== '' && v !== null && v !== undefined) {
        formData.append(k, v);
      }
    });
    if (file) {
      formData.append("file", file);
    }
    try {
      if (editId === 'new') {
        await createNews(formData);
      } else {
        await updateNews(editId, formData);
      }
      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    try {
      await disableNews(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const restore = async (id) => {
    try {
      await restoreNews(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>НОВОСТИ</h3>
        <span className="count-items">
          {tab === 'active' ? items.length : items.length} новостей
        </span>
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
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" aria-hidden />
          <input
            className="participants-search"
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="participants-search-clear" onClick={() => setSearch('')} aria-label="Очистить поиск">
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
        <AdminSelect value={year} onChange={setYear} options={years.map(y => ({ value: y, label: String(y) }))} placeholder="Год новости" />
        {(search || year) && (
          <button className="participants-reset-btn"
            onClick={() => {
              setSearch('');
              setYear('');
            }} >сбросить</button>
        )}
      </div>
      <div className="section-table-wrap news-table-wrap">
        <table className="section-table news-admin-table">
          <colgroup>
            <col className="news-colgroup-photo" />
            <col className="news-colgroup-title" />
            <col className="news-colgroup-brief" />
            <col className="news-colgroup-full" />
            <col className="news-colgroup-created" />
            <col className="news-colgroup-actions" />
          </colgroup>
          <thead>
            <tr>
              <th className="news-col-photo">Фото</th>
              <th className="news-col-title" onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                Заголовок {sort.key === 'name' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="news-col-brief">Краткое описание</th>
              <th className="news-col-full">Полное описание</th>
              <th className="news-col-created" onClick={() => toggleSort('created_at')} style={{ cursor: 'pointer' }}>
                Создана {sort.key === 'created_at' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th className="news-col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {tab === 'active' && editId === 'new' && (
              <NewsEditRow
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
                <td colSpan={6} className="section-empty">
                  Нет новостей
                </td>
              </tr>
            )}
            {items.map(item =>
              editId === item.id ? (
                <NewsEditRow
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
                  <td className="news-col-photo">
                    {item.image && (
                      <img className="section-thumbnail" src={`${API_URL}${item.image}`} alt="" />
                    )}
                  </td>
                  <td className="news-col-title">
                    <span className="news-cell-text news-cell-text--title">{item.name}</span>
                  </td>
                  <td className="news-col-brief">
                    <span className="news-cell-text">{item.brief_description}</span>
                  </td>
                  <td className="news-col-full">
                    <span className="news-cell-text">{item.full_description}</span>
                  </td>
                  <td className="news-col-created" style={{ whiteSpace: 'nowrap', color: '#999' }}>
                    {formatDate(item.created_at)}
                  </td>
                  <td className="news-col-actions">
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