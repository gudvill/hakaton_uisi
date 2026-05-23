import './Participants.css';
import { useEffect, useState, Fragment } from "react";
import { getRegistrations, disableRegistration, restoreRegistration, updateRegistration, deleteParticipant, createParticipant } from "../../../../api/registrationService";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, XMarkIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import AdminSelect from '../../AdminSelect';

const EDUCATION_LEVELS = [
  { value: 'спо 9класс', label: 'СПО (9 класс)' },
  { value: 'спо 11класс', label: 'СПО (11 класс)' },
  { value: 'бакалавриат/специалитет', label: 'Бакалавриат/Специалитет' },
  { value: 'магистратура', label: 'Магистратура' },
];
const CASE_OPTIONS = [1,2,3,4,5,6].map(c => ({ value: String(c), label: `Кейс ${c}` }));

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

  // Архив
  const [activeTab, setActiveTab] = useState('active');
  const [archived, setArchived] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

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
        is_available: true,
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

  const loadArchived = async () => {
    try {
      setArchivedLoading(true);
      const data = await getRegistrations({ is_available: false });
      setArchived(data);
    } catch (e) {
      console.error(e);
    } finally {
      setArchivedLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'archive') loadArchived();
  }, [activeTab]);

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
    if (activeTab === 'archive') loadArchived();
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Восстановить команду?")) return;
    await restoreRegistration(id);
    loadArchived();
  };

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  const startEdit = (team) => {
    setEditingTeam(team.id);
    setExpanded(team.id);

    setEditData({
      name: team.name,
      institution: team.institution,
      amount_participants: team.amount_participants,
      participation_form: team.participation_form,
      level_education: team.level_education,
      selected_case: Number(team.selected_case),
      spare_case: Number(team.spare_case),
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

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm("Удалить участника?")) return;
    await deleteParticipant(id);
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

  if (loading) return <p className="participants-loading">Загрузка...</p>;

  const SORT_COLUMNS = [
    { key: 'name', label: 'Команда' },
    { key: 'institution', label: 'Учреждение' },
    { key: 'level_education', label: 'Образование' },
    { key: 'selected_case', label: 'Кейс' },
    { key: 'amount_participants', label: 'Участников' },
    { key: 'created_at', label: 'Создана' },
  ];

  return (
    <div className="participants-wrap">
      <div className="participants-header">
        <h3 className="admin-card-title">УЧАСТНИКИ</h3>
        <span className="participants-count">
          {activeTab === 'active' ? registrations.length : archived.length} команд
        </span>
      </div>

      {/* ===== ВКЛАДКИ ===== */}
      <div className="participants-tabs">
        <button
          className={`participants-tab ${activeTab === 'active' ? 'participants-tab--active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Активные
        </button>
        <button
          className={`participants-tab ${activeTab === 'archive' ? 'participants-tab--active' : ''}`}
          onClick={() => setActiveTab('archive')}
        >
          Архив
          {archived.length > 0 && (
            <span className="participants-tab-badge">{archived.length}</span>
          )}
        </button>
      </div>

      {/* ===== АКТИВНЫЕ ===== */}
      {activeTab === 'active' && (
        <>
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
            <AdminSelect value={levelFilter} onChange={setLevelFilter} options={EDUCATION_LEVELS} placeholder="Образование" />
            <AdminSelect value={caseFilter} onChange={setCaseFilter} options={CASE_OPTIONS} placeholder="Все кейсы" />

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
                    {SORT_COLUMNS.map(({ key, label }) => (
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
                      <tr
                        className={`participants-row ${expanded === team.id ? "participants-row--open" : ""}`}
                        onClick={() => toggleExpand(team.id)}
                      >
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
                                onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                            </td>
                            <td>
                              <input className="section-input" value={editData.institution || ""} placeholder="Учреждение"
                                onChange={e => setEditData(p => ({ ...p, institution: e.target.value }))} />
                            </td>
                            <td>
                              <input className="section-input" value={editData.level_education || ""} placeholder="Уровень образования"
                                onChange={e => setEditData(p => ({ ...p, level_education: e.target.value }))} />
                            </td>
                            <td>
                              <input className="section-input" value={editData.selected_case || ""} placeholder="Кейс"
                                onChange={e => setEditData(p => ({ ...p, selected_case: e.target.value }))} />
                            </td>
                            <td>{team.amount_participants}</td>
                            <td>{formatDate(team.created_at)}</td>
                          </>
                        )}

                        <td className="participants-actions" onClick={e => e.stopPropagation()}>
                          <button className="participants-expand-btn" onClick={() => toggleExpand(team.id)}>
                            {expanded === team.id
                              ? <ChevronUpIcon style={{ width: 16 }} />
                              : <ChevronDownIcon style={{ width: 16 }} />}
                          </button>
                          <button className="participants-delete-btn" onClick={() => startEdit(team)}>
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
                                <div className="section-row-actions" style={{ marginBottom: 12 }}>
                                  <button className="section-save-btn" onClick={saveEdit}>сохранить</button>
                                  <button className="section-cancel-btn" onClick={() => {
                                    setEditingTeam(null);
                                    setEditData(null);
                                  }}>отмена</button>
                                  <button className="section-add-btn" onClick={handleAddParticipant}>+ участник</button>
                                </div>
                              )}

                              {editingTeam === team.id && editData ? (
                                <div className="participants-detail-cols">
                                  <div className="participants-detail-block">
                                    <p className="participants-detail-label">Запасной кейс</p>
                                    <input className="section-input" value={editData.spare_case || ""} placeholder="Запасной кейс"
                                      onChange={e => setEditData(p => ({ ...p, spare_case: e.target.value }))} />
                                  </div>
                                  <div className="participants-detail-block">
                                    <p className="participants-detail-label">Контакты капитана</p>
                                    <input className="section-input" value={editData.captain_phone || ""} placeholder="Телефон капитана"
                                      onChange={e => setEditData(p => ({ ...p, captain_phone: e.target.value }))} />
                                    <input className="section-input" value={editData.captain_email || ""} placeholder="Email капитана"
                                      onChange={e => setEditData(p => ({ ...p, captain_email: e.target.value }))} />
                                  </div>
                                  {team.curator_data && (
                                    <div className="participants-detail-block">
                                      <p className="participants-detail-label">Куратор</p>
                                      <input className="section-input" value={editData.curator_data.fio || ""} placeholder="ФИО куратора"
                                        onChange={e => setEditData(p => ({ ...p, curator_data: { ...p.curator_data, fio: e.target.value } }))} />
                                      <input className="section-input" value={editData.curator_data.phone || ""} placeholder="Телефон куратора"
                                        onChange={e => setEditData(p => ({ ...p, curator_data: { ...p.curator_data, phone: e.target.value } }))} />
                                    </div>
                                  )}
                                </div>
                              ) : (
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
                                      {editingTeam === team.id && <th></th>}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(editingTeam === team.id ? editData?.participants : team.participants).map((p, index) => (
                                      <tr key={p.id}>
                                        <td>
                                          {editingTeam === team.id ? (
                                            <input value={p.fio}
                                              onChange={e => setEditData(prev => ({
                                                ...prev,
                                                participants: prev.participants.map((p, i) =>
                                                  i === index ? { ...p, fio: e.target.value } : p
                                                ),
                                              }))}
                                            />
                                          ) : p.fio}
                                        </td>
                                        <td>
                                          {editingTeam === team.id ? (
                                            <input value={p.role}
                                              onChange={e => setEditData(prev => ({
                                                ...prev,
                                                participants: prev.participants.map((p, i) =>
                                                  i === index ? { ...p, role: e.target.value } : p
                                                ),
                                              }))}
                                            />
                                          ) : (ROLE_LABELS[p.role] || p.role)}
                                        </td>
                                        <td>
                                          {editingTeam === team.id ? (
                                            <input value={p.course}
                                              onChange={e => setEditData(prev => ({
                                                ...prev,
                                                participants: prev.participants.map((p, i) =>
                                                  i === index ? { ...p, course: e.target.value } : p
                                                ),
                                              }))}
                                            />
                                          ) : p.course}
                                        </td>
                                        {editingTeam === team.id && (
                                          <td>
                                            <button className="participants-delete-btn" onClick={() => handleDeleteParticipant(p.id)}>
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
        </>
      )}

      {/* ===== АРХИВ ===== */}
      {activeTab === 'archive' && (
        <>
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
            <AdminSelect value={levelFilter} onChange={setLevelFilter} options={EDUCATION_LEVELS} placeholder="Образование" />
            <AdminSelect value={caseFilter} onChange={setCaseFilter} options={CASE_OPTIONS} placeholder="Все кейсы" />

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
        <div className="participants-table-wrap">
          {archivedLoading ? (
            <p className="participants-loading">Загрузка...</p>
          ) : archived.length === 0 ? (
            <p className="participants-empty">Архив пуст</p>
          ) : (
            <table className="participants-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Команда</th>
                  <th>Учреждение</th>
                  <th>Образование</th>
                  <th>Кейс</th>
                  <th>Участников</th>
                  <th>Создана</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {archived.map((team, idx) => (
                  <tr key={team.id} className="participants-row participants-row--archived">
                    <td>{idx + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.institution}</td>
                    <td>{team.level_education || "—"}</td>
                    <td>{team.selected_case}</td>
                    <td>{team.amount_participants}</td>
                    <td>{formatDate(team.created_at)}</td>
                    <td className="participants-actions" onClick={e => e.stopPropagation()}>
                      <button
                        className="participants-restore-btn"
                        title="Восстановить"
                        onClick={() => handleRestore(team.id)}
                      >
                        <ArrowUturnLeftIcon style={{ width: 15, height: 15 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </>
      )}
    </div>
  );
}