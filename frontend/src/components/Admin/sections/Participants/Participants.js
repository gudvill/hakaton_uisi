import './Participants.css';
import { useEffect, useState, Fragment } from "react";
import {
  getRegistrations,
  disableRegistration,
  updateRegistration,
  deleteParticipant,
  createParticipant
} from "../../../../api/registrationService";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const ROLE_LABELS = {
  капитан: "Капитан",
  участник: "Участник",
  куратор: "Куратор",
};

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("ru-RU");
}

export default function Participants() {
  const [registrations, setRegistrations] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [caseFilter, setCaseFilter] = useState('');

  const [sort, setSort] = useState({ key: "created_at", dir: "desc" });

  const [editingTeam, setEditingTeam] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadData(true);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, levelFilter, caseFilter, sort]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const data = await getRegistrations({
        search: search || undefined,
        level: levelFilter || undefined,
        case_id: caseFilter ? Number(caseFilter) : undefined,
        sort_by: sort.key,
        sort_dir: sort.dir,
      });

      setRegistrations(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    loadData(true);
  };

  const toggleExpand = (id) =>
    setExpanded(prev => prev === id ? null : id);

  const startEdit = (team) => {
    setEditingTeam(team.id);
    setExpanded(team.id);

    setEditData({
      name: team.name,
      institution: team.institution,
      level_education: team.level_education,
      selected_case: Number(team.selected_case),
      spare_case: Number(team.spare_case),
      captain_phone: team.captain_phone,
      captain_email: team.captain_email,
      curator_data: team.curator_data || { fio: '', phone: '' },
      agreement: team.agreement,
      acquaintance: team.acquaintance,
      amount_participants: team.amount_participants,
      participants: JSON.parse(JSON.stringify(team.participants || [])),
    });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        team: {
          name: editData.name,
          institution: editData.institution,
          level_education: editData.level_education,
          selected_case: Number(editData.selected_case),
          spare_case: Number(editData.spare_case),
          captain_phone: editData.captain_phone,
          captain_email: editData.captain_email,
          curator_data: editData.curator_data,
          agreement: editData.agreement,
          acquaintance: editData.acquaintance,
          amount_participants: Number(editData.amount_participants),
        },
        participants: editData.participants.map(p => ({
          ...p,
          course: Number(p.course)
        })),
      };

      await updateRegistration(editingTeam, payload);

      setEditingTeam(null);
      setEditData(null);
      loadData(true);
    } catch (e) {
      alert(e.response?.data?.detail || "Ошибка");
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm("Удалить участника?")) return;
    await deleteParticipant(id);
    loadData(true);
  };

  const handleAddParticipant = async () => {
    const fio = prompt("ФИО");
    const course = prompt("Курс");
    const role = prompt("Роль (капитан/участник/куратор)");

    if (!fio || !course || !role) return;

    await createParticipant(editingTeam, {
      fio,
      course: Number(course),
      role
    });

    loadData(true);
  };

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  return (
    <div className="participants-wrap">

      <div className="participants-header">
        <h3 className="admin-card-title">УЧАСТНИКИ</h3>
        <span className="participants-count">{registrations.length} команд</span>
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
            <button
              className="participants-search-clear"
              onClick={() => setSearch('')}
            >
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <select
          className="participants-filter-select"
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
        >
          <option value="">Все уровни</option>
          <option value="спо 9класс">СПО (9 класс)</option>
          <option value="спо 11класс">СПО (11 класс)</option>
          <option value="бакалавриат/специалитет">Бакалавриат/Специалитет</option>
          <option value="магистратура">Магистратура</option>
        </select>

        <select
          className="participants-filter-select"
          value={caseFilter}
          onChange={e => setCaseFilter(e.target.value)}
        >
          <option value="">Все кейсы</option>
          {[1, 2, 3, 4, 5, 6].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {(search || levelFilter || caseFilter) && (
          <button
            className="participants-reset-btn"
            onClick={() => {
              setSearch('');
              setLevelFilter('');
              setCaseFilter('');
            }}
          >
            <XMarkIcon style={{ width: 14, height: 14 }} /> сбросить
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <p className="participants-empty">Нет команд</p>
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
                  <th
                    key={key}
                    className="participants-th-sort"
                    onClick={() => toggleSort(key)}
                  >
                    {label}
                    <span>
                      {sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  </th>
                ))}

                <th></th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((team, idx) => (
                <Fragment key={team.id}>

                  <tr
                    className={`participants-row ${expanded === team.id ? "participants-row--open" : ""}`}
                    onClick={() => toggleExpand(team.id)}
                  >
                    <td>{idx + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.institution}</td>
                    <td>{team.level_education || "—"}</td>
                    <td>{team.selected_case}</td>
                    <td>{team.amount_participants}</td>
                    <td>{formatDate(team.created_at)}</td>

                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleExpand(team.id)}>
                        {expanded === team.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </button>

                      <button onClick={() => startEdit(team)}>
                        <PencilIcon />
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

                          {editingTeam === team.id && (
                            <div>
                              <button onClick={saveEdit}>сохранить</button>
                              <button onClick={() => {
                                setEditingTeam(null);
                                setEditData(null);
                              }}>отмена</button>
                              <button onClick={handleAddParticipant}>+ участник</button>
                            </div>
                          )}

                          {editingTeam === team.id && editData && (
                            <div>
                              <input
                                value={editData.name || ''}
                                onChange={e =>
                                  setEditData(p => ({ ...p, name: e.target.value }))
                                }
                              />
                            </div>
                          )}

                          <table>
                            <tbody>
                              {(editingTeam === team.id ? editData?.participants : team.participants)
                                ?.map((p, i) => (
                                  <tr key={p.id || i}>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input
                                          value={p.fio}
                                          onChange={e => {
                                            setEditData(prev => ({
                                              ...prev,
                                              participants: prev.participants.map((x, idx) =>
                                                idx === i ? { ...x, fio: e.target.value } : x
                                              )
                                            }));
                                          }}
                                        />
                                      ) : p.fio}
                                    </td>

                                    <td>{ROLE_LABELS[p.role] || p.role}</td>

                                    <td>
                                      {editingTeam === team.id ? (
                                        <input
                                          value={p.course}
                                          onChange={e => {
                                            setEditData(prev => ({
                                              ...prev,
                                              participants: prev.participants.map((x, idx) =>
                                                idx === i ? { ...x, course: e.target.value } : x
                                              )
                                            }));
                                          }}
                                        />
                                      ) : p.course}
                                    </td>

                                    {editingTeam === team.id && (
                                      <td>
                                        <button onClick={() => handleDeleteParticipant(p.id)}>
                                          <TrashIcon />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                            </tbody>
                          </table>

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