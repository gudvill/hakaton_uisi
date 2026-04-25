import './Participants.css';
import { useEffect, useState, Fragment, useMemo } from "react";
import { getRegistrations, disableRegistration } from "../../../../api/registrationService";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const LEVEL_LABELS = {
  bachelor:   "Бакалавриат",
  master:     "Магистратура",
  specialist: "Специалитет",
  college:    "Колледж",
};

const ROLE_LABELS = {
  captain:     "Капитан",
  participant: "Участник",
  mentor:      "Куратор",
};

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Participants() {
  const [registrations, setRegistrations] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch]         = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [caseFilter, setCaseFilter]   = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  const toggleSort = (key) => setSort(prev =>
    prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
  );

  useEffect(() => {
    getRegistrations()
      .then(data => setRegistrations(data))
      .catch(err => console.error("Ошибка загрузки:", err))
      .finally(() => setLoading(false));
  }, []);

  const cases = useMemo(() =>
    [...new Set(registrations.map(r => r.selected_case).filter(Boolean))].sort(),
    [registrations]
  );

  const SORT_FN = {
    name:               (r) => r.name?.toLowerCase() ?? '',
    institution:        (r) => r.institution?.toLowerCase() ?? '',
    level_education:    (r) => LEVEL_LABELS[r.level_education] ?? '',
    selected_case:      (r) => r.selected_case?.toLowerCase() ?? '',
    amount_participants:(r) => r.amount_participants ?? 0,
    created_at:         (r) => new Date(r.created_at).getTime() || 0,
  };

  const filtered = useMemo(() => {
    const base = registrations.filter(r => {
      if (search && !r.name?.toLowerCase().includes(search.toLowerCase()) &&
                    !r.institution?.toLowerCase().includes(search.toLowerCase())) return false;
      if (levelFilter && r.level_education !== levelFilter) return false;
      if (caseFilter  && r.selected_case  !== caseFilter)  return false;
      return true;
    });
    if (!sort.key || !SORT_FN[sort.key]) return base;
    return [...base].sort((a, b) => {
      const va = SORT_FN[sort.key](a);
      const vb = SORT_FN[sort.key](b);
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [registrations, search, levelFilter, caseFilter, sort]);

  const hasFilters = search || levelFilter || caseFilter;
  const resetFilters = () => { setSearch(''); setLevelFilter(''); setCaseFilter(''); };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить команду?")) return;
    try {
      await disableRegistration(id);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  const toggleExpand = (id) => setExpanded(prev => (prev === id ? null : id));

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  return (
    <div className="participants-wrap">
      <div className="participants-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>УЧАСТНИКИ</h3>
        <span className="participants-count">
          {filtered.length !== registrations.length
            ? `${filtered.length} из ${registrations.length} команд`
            : `${registrations.length} команд`}
        </span>
      </div>

      {/* Фильтры */}
      <div className="participants-filters">
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" />
          <input
            className="participants-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по команде или учреждению..."
          />
          {search && (
            <button className="participants-search-clear" onClick={() => setSearch('')}>
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <select className="participants-filter-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          <option value="">Все уровни</option>
          {Object.entries(LEVEL_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select className="participants-filter-select" value={caseFilter} onChange={e => setCaseFilter(e.target.value)}>
          <option value="">Все кейсы</option>
          {cases.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasFilters && (
          <button className="participants-reset-btn" onClick={resetFilters}>
            <XMarkIcon style={{ width: 14, height: 14 }} /> сбросить
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="participants-empty">
          {hasFilters ? 'Ничего не найдено' : 'Нет зарегистрированных команд'}
        </p>
      ) : (
        <div className="participants-table-wrap">
          <table className="participants-table">
            <thead>
              <tr>
                <th>№</th>
                {[
                  { key: 'name',                label: 'Команда' },
                  { key: 'institution',         label: 'Учреждение' },
                  { key: 'level_education',     label: 'Образование' },
                  { key: 'selected_case',       label: 'Кейс' },
                  { key: 'amount_participants', label: 'Участников' },
                  { key: 'created_at',          label: 'Дата' },
                ].map(({ key, label }) => (
                  <th key={key} className="participants-th-sort" onClick={() => toggleSort(key)}>
                    {label}
                    <span className="participants-sort-icon">
                      {sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team, idx) => (
                <Fragment key={team.id}>
                  <tr
                    className={`participants-row ${expanded === team.id ? "participants-row--open" : ""}`}
                    onClick={() => toggleExpand(team.id)}
                  >
                    <td className="participants-num">{idx + 1}</td>
                    <td className="participants-name">{team.name || "—"}</td>
                    <td>{team.institution || "—"}</td>
                    <td>{LEVEL_LABELS[team.level_education] || team.level_education || "—"}</td>
                    <td>{team.selected_case || "—"}</td>
                    <td className="participants-center">{team.amount_participants ?? "—"}</td>
                    <td>{formatDate(team.created_at)}</td>
                    <td className="participants-actions" onClick={e => e.stopPropagation()}>
                      <button className="participants-expand-btn" onClick={() => toggleExpand(team.id)} title="Подробнее">
                        {expanded === team.id
                          ? <ChevronUpIcon style={{ width: 16, height: 16 }} />
                          : <ChevronDownIcon style={{ width: 16, height: 16 }} />}
                      </button>
                      <button className="participants-delete-btn" onClick={() => handleDelete(team.id)} title="Удалить">
                        <TrashIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </td>
                  </tr>

                  {expanded === team.id && (
                    <tr className="participants-detail-row">
                      <td colSpan={8}>
                        <div className="participants-detail">
                          <div className="participants-detail-cols">
                            <div className="participants-detail-block">
                              <p className="participants-detail-label">Контакты капитана</p>
                              <p>{team.captain_phone || "—"}</p>
                              <p>{team.captain_email || "—"}</p>
                            </div>
                            <div className="participants-detail-block">
                              <p className="participants-detail-label">Запасной кейс</p>
                              <p>{team.spare_case || "—"}</p>
                            </div>
                            {team.curator_data && (
                              <div className="participants-detail-block">
                                <p className="participants-detail-label">Куратор</p>
                                <p>{team.curator_data.fio || team.curator_data}</p>
                              </div>
                            )}
                          </div>

                          {team.participants?.length > 0 && (
                            <table className="participants-inner-table">
                              <thead>
                                <tr><th>ФИО</th><th>Роль</th><th>Курс</th></tr>
                              </thead>
                              <tbody>
                                {team.participants.map(p => (
                                  <tr key={p.id}>
                                    <td>{p.fio || "—"}</td>
                                    <td>{ROLE_LABELS[p.role] || p.role || "—"}</td>
                                    <td>{p.course || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
