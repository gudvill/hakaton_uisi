import './Participants.css';
import { useEffect, useState, Fragment } from "react";
import { getRegistrations, disableRegistration, updateRegistration, deleteParticipant, createParticipant } from "../../../../api/registrationService";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ROLE_LABELS = {
  captain: "Капитан",
  participant: "Участник",
  mentor: "Куратор",
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
        case_id: caseFilter || undefined,
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

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  const startEdit = (team) => {
    setEditingTeam(team.id);
    setEditData(JSON.parse(JSON.stringify(team)));
  };

  const saveEdit = async () => {
    try {
      await updateRegistration(editingTeam, {
        team: editData,
        participants: editData.participants
      });
      setEditingTeam(null);
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
    const role = prompt("Роль (captain / participant / mentor)");

    if (!fio || !course || !role) return;

    await createParticipant(editingTeam, { fio, course, role });
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
          <input className="participants-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по команде или учреждению..." />
          {search && (
            <button className="participants-search-clear" onClick={() => setSearch('')}>
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
        <select className="participants-filter-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          <option value="">Все уровни</option>
          <option value="спо 9класс">СПО (9 класс)</option>
          <option value="спо 11класс">СПО (11 класс)</option>
          <option value="бакалавриат/специалитет">Бакалавриат/Специалитет</option>
          <option value="магистратура">Магистратура</option>
        </select>
        <select className="participants-filter-select" value={caseFilter} onChange={e => setCaseFilter(e.target.value)}>
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
              {registrations.map((team, idx) => (
                <Fragment key={team.id}>
                  <tr className={`participants-row ${expanded === team.id ? "participants-row--open" : ""}`} onClick={() => toggleExpand(team.id)} >
                    <td>{idx + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.institution}</td>
                    <td>{team.level_education || "—"}</td>
                    <td>{team.selected_case}</td>
                    <td>{team.amount_participants}</td>
                    <td>{formatDate(team.created_at)}</td>
                    <td className="participants-actions" onClick={e => e.stopPropagation()}>
                      <button className="participants-expand-btn" onClick={() => toggleExpand(team.id)}>
                        {expanded === team.id
                          ? <ChevronUpIcon style={{ width: 16 }} />
                          : <ChevronDownIcon style={{ width: 16 }} />}
                      </button>
                      <button className="participants-delete-btn" onClick={() => startEdit(team)} >
                        <PencilIcon style={{ width: 15, height: 15 }} />
                      </button>
                      <button className="participants-delete-btn" onClick={() => handleDelete(team.id)}>
                        <TrashIcon style={{ width: 16 }} />
                      </button>
                    </td>
                  </tr>

                  {expanded === team.id && (
                    <tr className="participants-detail-row">
                      <td colSpan={8}>
                        <div className="participants-detail">
                          {editingTeam === team.id && (
                            <div style={{ marginBottom: 10 }}>
                              <button onClick={saveEdit}>💾 Сохранить</button>
                              <button onClick={() => setEditingTeam(null)}>Отмена</button>
                              <button onClick={handleAddParticipant}>+ Участник</button>
                            </div>
                          )}
                          <div className="participants-detail-cols">
                            <div className="participants-detail-block">
                              <p className="participants-detail-label">Запасной кейс</p>
                              <p>{team.spare_case || "—"}</p>
                            </div>
                            <div className="participants-detail-block">
                              <p className="participants-detail-label">Контакты капитана</p>
                              <p>{team.captain_phone || "—"}</p>
                              <p>{team.captain_email || "—"}</p>
                            </div>
                            {team.curator_data && (
                              <div className="participants-detail-block">
                                <p className="participants-detail-label">Куратор</p>
                                <p>{team.curator_data.fio || "—"}</p>
                                <p>{team.curator_data.phone || "—"}</p>
                              </div>
                            )}
                          </div>
                          {team.participants?.length > 0 && (
                            <table className="participants-inner-table">
                              <thead>
                                <tr>
                                  <th>ФИО</th>
                                  <th>Роль</th>
                                  <th>Курс</th>
                                  {editingTeam === team.id && <th></th>}
                                </tr>
                              </thead>
                              <tbody>
                                {(editingTeam === team.id ? editData.participants : team.participants).map((p, index) => (
                                  <tr key={p.id}>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input value={p.fio} onChange={e => {
                                            const copy = { ...editData };
                                            copy.participants[index].fio = e.target.value;
                                            setEditData(copy);
                                          }}
                                        />
                                      ) : p.fio}
                                    </td>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input value={p.role} onChange={e => {
                                            const copy = { ...editData };
                                            copy.participants[index].role = e.target.value;
                                            setEditData(copy);
                                          }}
                                        />
                                      ) : (ROLE_LABELS[p.role] || p.role)}
                                    </td>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input value={p.course} onChange={e => {
                                            const copy = { ...editData };
                                            copy.participants[index].course = e.target.value;
                                            setEditData(copy);
                                          }}
                                        />
                                      ) : p.course}
                                    </td>
                                    {editingTeam === team.id && (
                                      <td>
                                        <button onClick={() => handleDeleteParticipant(p.id)}>❌</button>
                                      </td>
                                    )}
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