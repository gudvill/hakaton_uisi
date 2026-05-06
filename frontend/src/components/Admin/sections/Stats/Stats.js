import './Stats.css';
import { useEffect, useState } from 'react';
import { getStats } from '../../../../api/statsService';
import { UserGroupIcon, UsersIcon, AcademicCapIcon, BookOpenIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const CARDS_CONFIG = [
  { key: 'teams',    label: 'Команд',       Icon: UserGroupIcon,   color: '#6a35cc', bg: '#f3f0ff' },
  { key: 'members',  label: 'Участников',   Icon: UsersIcon,       color: '#3b82f6', bg: '#eff6ff' },
  { key: 'bachelor', label: 'Бакалавриат/Специалитет', Icon: AcademicCapIcon, color: '#10b981', bg: '#f0fdf4' },
  { key: 'master',   label: 'Магистратура', Icon: BookOpenIcon,    color: '#f59e0b', bg: '#fffbeb' },
  { key: 'spo9',     label: 'СПО (после 9)',  Icon: BuildingOfficeIcon, color: '#ec4899', bg: '#fdf2f8' },
  { key: 'spo11',    label: 'СПО (после 11)', Icon: BuildingOfficeIcon, color: '#f43f5e', bg: '#fff1f2' },
];

export default function Stats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#999', fontSize: 14 }}>Загрузка...</p>;
  if (!data) return <p>Ошибка загрузки</p>;

  const matrix = data.participants_matrix || {};

  const sumLevel = (level) =>
    matrix[level]
      ? Object.values(matrix[level]).reduce((a, b) => a + b, 0)
      : 0;

  const values = {
    teams: data.totals?.teams || 0,
    members: data.totals?.participants || 0,
    bachelor: sumLevel('бакалавриат/специалитет'),
    master: sumLevel('магистратура'),
    spo9: sumLevel('спо 9класс'),
    spo11: sumLevel('спо 11класс'),
  };

  const yearData = data.teams_by_year || [];

  const heatmapData = [];
  Object.entries(matrix).forEach(([level, courses]) => {
    Object.entries(courses).forEach(([course, count]) => {
      heatmapData.push({
        level,
        course: `Курс ${course}`,
        count
      });
    });
  });

  const partnersData = data.top_partners || [];

  const tooltipStyle = {
    borderRadius: 8,
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">СТАТИСТИКА</h3>
      {/* Карточки */}
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
      {/* График: команды по годам */}
      <div style={{ marginTop: 40 }}>
        <h4>Команды по годам</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="count" fill="#6a35cc" radius={[6, 6, 0, 0]} maxBarSize={40} name="Команды" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* График: участники */}
      <div style={{ marginTop: 40 }}>
        <h4>Участники по уровню и курсу</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={heatmapData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="course" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={30} name="Участники" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Топ партнёров */}
      <div style={{ marginTop: 40 }}>
        <h4>Топ партнёров</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={partnersData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="cases_count" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} name="Кейсы" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}