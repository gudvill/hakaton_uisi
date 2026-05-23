import './Cases.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminYearOptions } from '../../yearRange';
import { getCases, getArchivedCases, createCase, updateCase, disableCase, restoreCase } from '../../../../api/casesService';
import { getPartners } from '../../../../api/partnersService';
import { PencilIcon, TrashIcon, PlusIcon, ArchiveBoxIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminSelect from '../../AdminSelect';

const LEVELS = [
  { value: 'стартовый', label: 'Стартовый' },
  { value: 'продвинутый', label: 'Продвинутый' },
];

const SORTABLE_KEYS = ['name', 'partner', 'created_at'];

function CasesEditRow({ form, setForm, partnerOptions, onSave, onCancel }) {
  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );
  return (
    <tr className="section-edit-row">
      <td style={{ width: 70 }}>{inp('case_number', '№')}</td>
      <td>{inp('name', 'Название кейса')}</td>
      <td style={{ width: 150 }}>
        <AdminSelect
          variant="form"
          value={form.level || ''}
          onChange={v => setForm(p => ({ ...p, level: v }))}
          options={LEVELS}
          placeholder="Уровень"
        />
      </td>
      <td>
        <AdminSelect
          variant="form"
          value={form.partner_id || ''}
          onChange={v => setForm(p => ({ ...p, partner_id: v }))}
          options={partnerOptions}
          placeholder="Партнёр"
        />
      </td>
      <td>{inp('teams_count', 'Кол-во команд')}</td>
      <td className="cases-col-desc">
        <textarea className="section-textarea cases-desc-textarea" value={form.description || ''} placeholder="Описание" onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </td>
      <td colSpan={2} style={{ verticalAlign: 'top' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <button type="button" className="section-save-btn" onClick={onSave}>сохранить</button>
          <button type="button" className="section-cancel-btn" onClick={onCancel}>отмена</button>
        </div>
      </td>
    </tr>
  );
}

export default function Cases() {
  const [items, setItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sort, setSort] = useState({ key: "case_number", dir: "asc" });
  const [loading, setLoading] = useState(true);
  const years = useMemo(() => getAdminYearOptions(), []);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const params = {
        search: search || undefined,
        year: yearFilter ? Number(yearFilter) : undefined,
        level: levelFilter || undefined,
        sort_by: sort.key,
        sort_dir: sort.dir,
      };

      const data =
        tab === 'archive'
          ? await getArchivedCases(params)
          : await getCases(params);

      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [search, yearFilter, levelFilter, sort, tab]);

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      load(true);
    }, 400);
    return () => clearTimeout(delay);
  }, [load]);

  useEffect(() => {
    load(false);
    getPartners().then(setPartners).catch(console.error);
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

  const partnerOptions = partners.map(p => ({ value: p.id, label: p.name }));

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ ...item, partner_id: item.partner_id?.toString() || '' });
  };

  const startAdd = () => {
    setEditId('new');
    setForm({ name: '', level: '', partner_id: '', case_number: '', description: '', teams_count: 0 });
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  const normalize = (data) => ({
    ...data,
    case_number: data.case_number ? Number(data.case_number) : null,
    teams_count: data.teams_count ? Number(data.teams_count) : 0,
    partner_id: data.partner_id ? Number(data.partner_id) : null,
  });

  const save = async () => {
    try {
      const payload = normalize(form);

      if (editId === 'new') {
        await createCase(payload);
      } else {
        await updateCase(editId, payload);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await disableCase(id);
    load();
  };

  const restore = async (id) => {
    await restoreCase(id);
    load();
  };

  const levelLabel = (val) => LEVELS.find(l => l.value === val)?.label || val || '—';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '—';

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>КЕЙСЫ</h3>
        <span className="count-items">
          {tab === 'active' ? items.length : items.length} кейсов
        </span>
        {tab === 'active' && (
          <button className="section-add-btn" onClick={startAdd}>
            <PlusIcon style={{ width: 16, height: 16 }} /> добавить
          </button>
        )}
      </div>

      {/* ВКЛАДКИ */}
      <div className="news-tabs">
        <button
          className={`news-tab ${tab === 'active' ? 'news-tab--active' : ''}`}
          onClick={() => { setTab('active'); cancel(); }} >
          Активные
        </button>
        <button
          className={`news-tab ${tab === 'archive' ? 'news-tab--active' : ''}`}
          onClick={() => { setTab('archive'); cancel(); }} >
          Архив
        </button>
      </div>
      {/* ФИЛЬТРЫ */}
      <div className="participants-filters">
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" aria-hidden />
          <input
            className="participants-search"
            placeholder="Поиск по названию кейса..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="participants-search-clear" onClick={() => setSearch('')} aria-label="Очистить поиск">
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
        <AdminSelect value={yearFilter} onChange={setYearFilter} options={years.map(y => ({ value: y, label: String(y) }))} placeholder="Год" />
        <AdminSelect value={levelFilter} onChange={setLevelFilter} options={LEVELS} placeholder="Уровень" />

        {(search || yearFilter || levelFilter) && (
          <button className="participants-reset-btn"
            onClick={() => {
              setSearch('');
              setYearFilter('');
              setLevelFilter('');
            }} >сбросить</button>
        )}
      </div>
      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th>№</th>
              {[
                { key: 'name', label: 'Название' },
                { key: 'level', label: 'Уровень' },
                { key: 'partner', label: 'Партнёр' },
                { key: 'teams_count', label: 'Разрешено команд' },
                { key: 'description', label: 'Описание' },
                { key: 'created_at', label: 'Создан' },
              ].map(({ key, label }) => (
                <th key={key} className={SORTABLE_KEYS.includes(key) ? "participants-th-sort" : ""} onClick={() => toggleSort(key)} >
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
              <CasesEditRow
                form={form}
                setForm={setForm}
                partnerOptions={partnerOptions}
                onSave={save}
                onCancel={cancel}
              />
            )}
            {items.length === 0 && editId !== 'new' && (
              <tr>
                <td colSpan={8} className="section-empty">Нет кейсов</td>
              </tr>
            )}
            {items.map(item => editId === item.id ? (
              <CasesEditRow
                key={item.id}
                form={form}
                setForm={setForm}
                partnerOptions={partnerOptions}
                onSave={save}
                onCancel={cancel}
              />
            ) : (
              <tr key={item.id}>
                <td><span className="section-badge">{item.case_number || '—'}</span></td>
                <td className="cases-name">{item.name}</td>
                <td>
                  {item.level ? (
                    <span className={`cases-level-badge cases-level-badge--${item.level}`}>
                      {levelLabel(item.level)}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ color: '#666' }}>{item.partner_name || '—'}</td>
                <td>{item.registered_teams_count ?? 0}/{item.teams_count ?? 0}</td>
                <td>{item.description || '—'}</td>
                <td style={{ color: '#999' }}>{formatDate(item.created_at)}</td>
                <td>
                  <div className="section-row-actions">
                      {tab === 'active' ? (
                        <>
                          <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)}>
                            <PencilIcon style={{ width: 15 }} />
                          </button>
                          <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)}>
                            <TrashIcon style={{ width: 15 }} />
                          </button>
                        </>
                      ) : (
                        <button className="section-icon-btn section-icon-btn--edit" title="Восстановить" onClick={() => restore(item.id)} >
                          <ArchiveBoxIcon style={{ width: 15 }} />
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