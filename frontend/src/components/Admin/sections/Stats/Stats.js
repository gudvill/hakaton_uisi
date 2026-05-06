import './Stats.css';
import { useEffect, useState } from 'react';
import { getStats } from '../../../../api/statsService';
import { UserGroupIcon, UsersIcon, AcademicCapIcon, BookOpenIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const CARDS_CONFIG = [
  { key: 'teams', label: 'Команд', Icon: UserGroupIcon, color: '#6a35cc', bg: '#f3f0ff' },
  { key: 'members', label: 'Участников', Icon: UsersIcon, color: '#3b82f6', bg: '#eff6ff' },
  { key: 'avg_team', label: 'Средний размер команды', Icon: UsersIcon, color: '#14b8a6', bg: '#f0fdfa' },
  { key: 'bachelor', label: 'Бакалавриат/Специалитет', Icon: AcademicCapIcon, color: '#10b981', bg: '#f0fdf4' },
  { key: 'master', label: 'Магистратура', Icon: BookOpenIcon, color: '#f59e0b', bg: '#fffbeb' },
  { key: 'spo9', label: 'СПО (после 9)', Icon: BuildingOfficeIcon, color: '#ec4899', bg: '#fdf2f8' },
  { key: 'spo11', label: 'СПО (после 11)', Icon: BuildingOfficeIcon, color: '#f43f5e', bg: '#fff1f2' },
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

  if (loading) return <p style={{ color: '#999' }}>Загрузка...</p>;
  if (!data) return <p>Ошибка загрузки</p>;

  const matrix = data.participants_matrix || {};

  const sumLevel = (level) =>
    matrix[level]
      ? Object.values(matrix[level]).reduce((a, b) => a + b, 0)
      : 0;

  const values = {
    teams: data.totals?.teams || 0,
    members: data.totals?.participants || 0,
    avg_team: data.totals?.avg_team_size || 0,
    bachelor: sumLevel('бакалавриат/специалитет'),
    master: sumLevel('магистратура'),
    spo9: sumLevel('спо 9класс'),
    spo11: sumLevel('спо 11класс'),
  };

  const levels = [
    'бакалавриат/специалитет',
    'магистратура',
    'спо 9класс',
    'спо 11класс'
  ];

  const coursesSet = new Set();

  Object.values(matrix).forEach(courses => {
    Object.keys(courses).forEach(c => coursesSet.add(c));
  });

  const heatmapData = Array.from(coursesSet)
    .sort((a, b) => Number(a) - Number(b))
    .map(course => {
      const row = { course: `Курс ${course}` };

      levels.forEach(level => {
        row[level] = matrix[level]?.[course] || 0;
      });

      return row;
    });

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
      {/* Динамика регистраций */}
      <div style={{ marginTop: 40 }}>
        <h4>Динамика регистраций</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.registrations_dynamics}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="date" label={{ value: 'Дата', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Регистрации', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#6a35cc" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Форма участия */}
      <div style={{ marginTop: 40 }}>
        <h4>Форма участия</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.participation_forms}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="participation_form" label={{ value: 'Форма', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Количество', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* География */}
      <div style={{ marginTop: 40 }}>
        <h4>Топ учебных заведений</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.top_institutions}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="institution" />
            <YAxis label={{ value: 'Команды', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Участники */}
      <div style={{ marginTop: 40 }}>
        <h4>Участники по уровню и курсу</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={heatmapData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="course" label={{ value: 'Курс', position: 'insideBottom' }} />
            <YAxis label={{ value: 'Участники', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="бакалавриат/специалитет" stackId="a" fill="#10b981" />
            <Bar dataKey="магистратура" stackId="a" fill="#f59e0b" />
            <Bar dataKey="спо 9класс" stackId="a" fill="#ec4899" />
            <Bar dataKey="спо 11класс" stackId="a" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Партнёры */}
      <div style={{ marginTop: 40 }}>
        <h4>Топ партнёров</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.top_partners}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Кейсы', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="cases_count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}