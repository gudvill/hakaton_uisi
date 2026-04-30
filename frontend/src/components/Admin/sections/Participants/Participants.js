import './Participants.css';
import { useEffect, useState, Fragment } from "react";
import { getRegistrations, getArchivedRegistrations, disableRegistration, restoreRegistration, updateRegistration, deleteParticipant, createParticipant } from "../../../../api/registrationService";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ROLE_LABELS = {
  капитан: "Капитан",
  участник: "Участник",
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
  const [activeTab, setActiveTab] = useState('active'); // 'active' или 'archive'

  useEffect(() => {
    const delay = setTimeout(() => {
      loadData(true);
    }, 400);
    return () => clearTimeout(delay);
  }, [search, levelFilter, caseFilter, sort, activeTab]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const params = {
        search: search || undefined,
        level: levelFilter || undefined,
        case_id: caseFilter ? Number(caseFilter) : undefined,
        sort_by: sort.key,
        sort_dir: sort.dir,
      };

      const data = activeTab === 'archive'
        ? await getArchivedRegistrations(params)
        : await getRegistrations(params);

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
    if (activeTab === 'archive') return; // Блокировка для архива
    setEditingTeam(team.id);
    setExpanded(team.id);

    setEditData({
      name: team.name,
      institution: team.institution,
      amount_participants: team.amount_participants,
      participation_form: team.participation_form,
      level_education: team.level_education,
      selected_case: team.selected_case ? Number(team.selected_case) : null,
      spare_case: team.spare_case ? Number(team.spare_case) : null,
      captain_phone: team.captain_phone,
      captain_email: team.captain_email,
      curator_data: team.curator_data || { fio: '', phone: '' },
      agreement: team.agreement,
      acquaintance: team.acquaintance,
      participants: JSON.parse(JSON.stringify(team.participants || [])),
    });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        team: {
          name: editData.name,
          institution: editData.institution,
          amount_participants: editData.amount_participants,
          participation_form: editData.participation_form,
          level_education: editData.level_education,
          selected_case: editData.selected_case,
          spare_case: editData.spare_case,
          captain_phone: editData.captain_phone,
          captain_email: editData.captain_email,
          curator_data: editData.curator_data,
          agreement: editData.agreement,
          acquaintance: editData.acquaintance,
        },
        participants: editData.participants.map(p => ({
          fio: p.fio,
          course: Number(p.course),
          role: p.role
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

  const handleDeleteParticipant = async (participantId, localIndex = null) => {
    if (localIndex !== null && editingTeam) {
      // Локальное удаление нового участника (без id)
      setEditData(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== localIndex)
      }));
      return;
    }

    if (!window.confirm("Удалить участника?")) return;
    await deleteParticipant(participantId);
    loadData(true);
  };

  const handleAddParticipant = async () => {
    const fio = prompt("ФИО");
    const course = prompt("Курс");
    const role = prompt("Роль (капитан/участник)");

    if (!fio || !course || !role) return;

    await createParticipant(editingTeam, { fio, course: Number(course), role });
    loadData(true);
  };

  const handleRestore = async (id) => {
    try {
      await restoreRegistration(id);
      loadData(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Ошибка восстановления");
    }
  };

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  return (
    <div className="participants-wrap">
      <div className="participants-header">
        <h3 className="admin-card-title">УЧАСТНИКИ</h3>
        <span className="participants-count">
          {activeTab === 'active' ? registrations.length : registrations.length} команд
        </span>
      </div>

      {/* ===== ВКЛАДКИ ===== */}
      <div className="participants-tabs">
        <button className={`participants-tab ${activeTab === 'active' ? 'participants-tab--active' : ''}`}
          onClick={() => setActiveTab('active')} >Активные</button>

        <button className={`participants-tab ${activeTab === 'archive' ? 'participants-tab--active' : ''}`}
          onClick={() => setActiveTab('archive')} >Архив</button>
      </div>

      {/* ===== ФИЛЬТРЫ ===== */}
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
          <option value="">Образование</option>
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
        <p className="participants-empty">
          {activeTab === 'archive'
            ? 'Нет архивных команд'
            : 'Нет активных команд'}
        </p>
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
                  <th key={key} className="participants-th-sort" onClick={() => toggleSort(key)} >
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
                    {editingTeam !== team.id ? (
                      <>
                        <td>{team.name}</td>
                        <td>{team.institution}</td>
                        <td>{team.level_education || "—"}</td>
                        <td>{team.selected_case}</td>
                        <td>{team.amount_participants}</td>
                        <td>{formatDate(team.created_at)}</td>
                      </>
                    ) : (
                      <>
                        <td>
                          <input className="section-input" value={editData.name || ""} placeholder="Название команды"
                            onChange={e =>
                              setEditData(p => ({ ...p, name: e.target.value }))
                            }
                          />
                        </td>
                        <td>
                          <input className="section-input" value={editData.institution || ""} placeholder="Учреждение"
                            onChange={e =>
                              setEditData(p => ({ ...p, institution: e.target.value }))
                            }
                          />
                        </td>
                        <td>
                          <input className="section-input" value={editData.level_education || ""} placeholder="Уровень образования"
                            onChange={e =>
                              setEditData(p => ({ ...p, level_education: e.target.value }))
                            }
                          />
                        </td>
                        <td>
                          <input className="section-input" value={editData.selected_case || ""} placeholder="Кейс"
                            onChange={e =>
                              setEditData(p => ({
                                ...p,
                                selected_case: Number(e.target.value) || null
                              }))
                            }
                          />
                        </td>
                        <td>{team.amount_participants}</td>
                        <td>{formatDate(team.created_at)}</td>
                      </>
                    )}

                    <td className="participants-actions" onClick={e => e.stopPropagation()}>
                      <button className="participants-expand-btn" onClick={() => toggleExpand(team.id)}>
                        {expanded === team.id ? (
                          <ChevronUpIcon style={{ width: 16 }} />
                        ) : (
                          <ChevronDownIcon style={{ width: 16 }} />
                        )}
                      </button>

                      {activeTab === 'active' && (
                        <>
                          <button className="participants-delete-btn" onClick={() => startEdit(team)}>
                            <PencilIcon style={{ width: 15 }} />
                          </button>
                          <button className="participants-delete-btn" onClick={() => handleDelete(team.id)}>
                            <TrashIcon style={{ width: 16 }} />
                          </button>
                        </>
                      )}

                      {activeTab === 'archive' && (
                        <button className="participants-restore-btn" onClick={() => { e.stopPropagation(); handleRestore(team.id); }}>восстановить</button>
                      )}
                    </td>
                  </tr>
                  {expanded === team.id && (
                    <tr className="participants-detail-row">
                      <td colSpan={8}>
                        <div className="participants-detail">
                          {editingTeam === team.id && (
                            <div className="section-row-actions">
                              <button className="section-save-btn" onClick={saveEdit}>сохранить</button>
                              <button className="section-cancel-btn" onClick={() => {
                                setEditingTeam(null);
                                setEditData(null);
                              }}>отмена</button>
                              {activeTab === 'active' && (
                                <button className="section-add-btn" onClick={handleAddParticipant}>+ участник</button>
                              )}
                            </div>
                          )}
                          
                          {editingTeam === team.id && editData && (
                            <>
                              <div className="participants-detail-cols">
                                <div className="participants-detail-block">
                                  <p className="participants-detail-label">Запасной кейс</p>
                                  <input className="section-input" type="number" value={editData.spare_case || ""} placeholder="Запасной кейс"
                                    onChange={e => setEditData(p => ({ ...p, spare_case: Number(e.target.value) || null }))} 
                                  />
                                </div>
                                <div className="participants-detail-block">
                                  <p className="participants-detail-label">Контакты капитана</p>
                                  <input className="section-input" value={editData.captain_phone || ""} placeholder="Телефон капитана"
                                    onChange={e => setEditData(p => ({ ...p, captain_phone: e.target.value }))} 
                                  />
                                  <input className="section-input" value={editData.captain_email || ""} placeholder="Email капитана"
                                    onChange={e => setEditData(p => ({ ...p, captain_email: e.target.value }))} 
                                  />
                                </div>
                                {editData.curator_data && (
                                  <div className="participants-detail-block">
                                    <p className="participants-detail-label">Куратор</p>
                                    <input className="section-input" value={editData.curator_data.fio || ""} placeholder="ФИО куратора"
                                      onChange={e => setEditData(p => ({ 
                                        ...p, 
                                        curator_data: { ...p.curator_data, fio: e.target.value } 
                                      }))} 
                                    />
                                    <input className="section-input" value={editData.curator_data.phone || ""} placeholder="Телефон куратора"
                                      onChange={e => setEditData(p => ({ 
                                        ...p, 
                                        curator_data: { ...p.curator_data, phone: e.target.value } 
                                      }))} 
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          
                          {editingTeam !== team.id && (
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
                          )}
                          
                          {team.participants?.length > 0 && (
                            <table className="participants-inner-table">
                              <thead>
                                <tr>
                                  <th>ФИО</th>
                                  <th>Роль</th>
                                  <th>Курс</th>
                                  {editingTeam === team.id && activeTab === 'active' && <th></th>}
                                </tr>
                              </thead>
                              <tbody>
                                {(editingTeam === team.id ? editData?.participants : team.participants).map((p, index) => (
                                  <tr key={p.id || `new-${index}`}>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input 
                                          className="section-input"
                                          value={p.fio}
                                          onChange={e => {
                                            setEditData(prev => ({
                                              ...prev,
                                              participants: prev.participants.map((pp, i) =>
                                                i === index ? { ...pp, fio: e.target.value } : pp
                                              ),
                                            }));
                                          }}
                                        />
                                      ) : (
                                        p.fio
                                      )}
                                    </td>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input 
                                          className="section-input"
                                          value={p.role}
                                          onChange={e => {
                                            setEditData(prev => ({
                                              ...prev,
                                              participants: prev.participants.map((pp, i) =>
                                                i === index ? { ...pp, role: e.target.value } : pp
                                              ),
                                            }));
                                          }}
                                        />
                                      ) : (
                                        ROLE_LABELS[p.role] || p.role
                                      )}
                                    </td>
                                    <td>
                                      {editingTeam === team.id ? (
                                        <input 
                                          className="section-input"
                                          type="number"
                                          value={p.course}
                                          onChange={e => {
                                            setEditData(prev => ({
                                              ...prev,
                                              participants: prev.participants.map((pp, i) =>
                                                i === index ? { ...pp, course: e.target.value } : pp
                                              ),
                                            }));
                                          }}
                                        />
                                      ) : (
                                        p.course
                                      )}
                                    </td>
                                    {editingTeam === team.id && activeTab === 'active' && (
                                      <td>
                                        <button 
                                          className="participants-delete-btn" 
                                          onClick={() => handleDeleteParticipant(p.id, index)}
                                        >
                                          <TrashIcon style={{ width: 16 }} />
                                        </button>
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