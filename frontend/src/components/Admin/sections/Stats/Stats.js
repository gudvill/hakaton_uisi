import './Stats.css';
import { useEffect, useState } from 'react';
import { getRegistrations } from '../../../../api/registrationService';
import { UserGroupIcon, UsersIcon, AcademicCapIcon, BookOpenIcon, BuildingLibraryIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const CARDS_CONFIG = [
  { key: 'teams',      label: 'Команд',       Icon: UserGroupIcon,       color: '#6a35cc', bg: '#f3f0ff' },
  { key: 'members',    label: 'Участников',   Icon: UsersIcon,           color: '#3b82f6', bg: '#eff6ff' },
  { key: 'bachelor',   label: 'Бакалавриат',  Icon: AcademicCapIcon,     color: '#10b981', bg: '#f0fdf4' },
  { key: 'master',     label: 'Магистратура', Icon: BookOpenIcon,        color: '#f59e0b', bg: '#fffbeb' },
  { key: 'specialist', label: 'Специалитет',  Icon: BuildingLibraryIcon, color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'college',    label: 'Колледж',      Icon: BuildingOfficeIcon,  color: '#ec4899', bg: '#fdf2f8' },
];

export default function Stats() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRegistrations().then(setRegs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const byLevel = regs.reduce((acc, r) => {
    const l = r.level_education || 'other';
    acc[l] = (acc[l] || 0) + 1;
    return acc;
  }, {});

  const values = {
    teams:      regs.length,
    members:    regs.reduce((s, r) => s + (r.participants?.length || 0), 0),
    bachelor:   byLevel['bachelor']   || 0,
    master:     byLevel['master']     || 0,
    specialist: byLevel['specialist'] || 0,
    college:    byLevel['college']    || 0,
  };

  if (loading) return <p style={{ color: '#999', fontSize: 14 }}>Загрузка...</p>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">СТАТИСТИКА</h3>
      <div className="stats-grid">
        {CARDS_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <div key={key} className="stat-card" style={{ background: bg }}>
            <div className="stat-icon-wrap" style={{ background: color }}>
              <Icon style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <span className="stat-value" style={{ color }}>{values[key]}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
