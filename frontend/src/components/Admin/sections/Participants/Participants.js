import './Participants.css';
import { useEffect, useState, Fragment } from "react";
import { getRegistrations, disableRegistration } from "../../../../api/registrationService";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const LEVEL_LABELS = {
  bachelor: "Бакалавриат",
  master: "Магистратура",
  specialist: "Специалитет",
  college: "Колледж",
};

const ROLE_LABELS = {
  captain: "Капитан",
  participant: "Участник",
  mentor: "Куратор",
};

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("ru-RU");
}

export default function Participants() {
  const [registrations, setRegistrations] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [caseFilter, setCaseFilter] = useState('');
  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getRegistrations({ search, level: levelFilter, case_id: caseFilter, sort_by: sort.key, sort_dir: sort.dir });
      setRegistrations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchData, 300);
    return () => clearTimeout(delay);
  }, [search, levelFilter, caseFilter, sort]);

  const toggleSort = (key) => {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить команду?")) return;
    await disableRegistration(id);
    fetchData();
  };

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  return (
    <div className="participants-wrap">
      <div className="participants-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>УЧАСТНИКИ</h3>
        <span className="participants-count">{registrations.length} команд</span>
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="participants-filters">
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" />
          <input className="participants-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." />
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

        <input className="participants-filter-select" placeholder="ID кейса" value={caseFilter} onChange={e => setCaseFilter(e.target.value)} />
      </div>

      {registrations.length === 0 ? (
        <p className="participants-empty">Нет данных</p>
      ) : (
        <div className="participants-table-wrap">
          <table className="participants-table">
            <thead>
              <tr>
                <th>№</th>
                {[
                  { key: 'name', label: 'Команда' },
                  { key: 'institution', label: 'Учреждение' },
                  { key: 'level_education', label: 'Образование' },
                  { key: 'selected_case', label: 'Кейс' },
                  { key: 'amount_participants', label: 'Участников' },
                  { key: 'created_at', label: 'Создана' },
                ].map(({ key, label }) => (
                  <th key={key} onClick={() => toggleSort(key)}>
                    {label}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((team, idx) => (
                <Fragment key={team.id}>
                  <tr onClick={() => toggleExpand(team.id)}>
                    <td>{idx + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.institution}</td>
                    <td>{LEVEL_LABELS[team.level_education]}</td>
                    <td>{team.selected_case}</td>
                    <td>{team.amount_participants}</td>
                    <td>{formatDate(team.created_at)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleExpand(team.id)}>
                        {expanded === team.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </button>
                      <button onClick={() => handleDelete(team.id)}>
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>

                  {expanded === team.id && (
                    <tr>
                      <td colSpan={8}>
                        <div>
                          <p><b>Контакты капитана:</b></p>
                          <p>{team.captain_phone}</p>
                          <p>{team.captain_email}</p>
                          <p><b>Куратор:</b></p>
                          <p>{team.curator_data?.fio}</p>
                          <p>{team.curator_data?.phone}</p>
                          <p><b>Запасной кейс:</b> {team.spare_case}</p>
                          {team.participants?.length > 0 && (
                            <table>
                              <tbody>
                                {team.participants.map(p => (
                                  <tr key={p.id}>
                                    <td>{p.fio}</td>
                                    <td>{ROLE_LABELS[p.role]}</td>
                                    <td>{p.course}</td>
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