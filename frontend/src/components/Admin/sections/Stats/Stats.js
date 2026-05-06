import './Stats.css';
import { useEffect, useState } from 'react';
import { getStats } from '../../../../api/statsService';
import { UserGroupIcon, UsersIcon, AcademicCapIcon, BookOpenIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line, ScatterChart, Scatter, ZAxis } from 'recharts';

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

  const tooltipStyle = {
    borderRadius: 8,
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  const yearData = data.teams_by_year || [];
  const scatterData = [];

  Object.entries(matrix).forEach(([level, courses]) => {
    Object.entries(courses).forEach(([course, count]) => {
      scatterData.push({
        level,
        x: Number(course),
        y: count,
      });
    });
  });

  const levelColors = {
    'бакалавриат/специалитет': '#10b981',
    'магистратура': '#f59e0b',
    'спо 9класс': '#ec4899',
    'спо 11класс': '#f43f5e',
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
      {/* Команды по годам */}
      <div style={{ marginTop: 40 }}>
        <h4>Команды по годам</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={yearData} margin={{ bottom: 30 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="year" label={{ value: 'Год', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Количество команд', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#6a35cc" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Динамика регистраций */}
      <div style={{ marginTop: 40 }}>
        <h4>Динамика регистраций</h4>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.registrations_dynamics} margin={{ bottom: 30 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="date" label={{ value: 'Дата', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Количество регистраций', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#6a35cc" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Форма участия */}
      <div style={{ marginTop: 40 }}>
        <h4>Форма участия</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.participation_forms} margin={{ bottom: 30 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="participation_form" />
            <YAxis label={{ value: 'Количество команд', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#3b82f6" maxBarSize={50} radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Топ учебных заведений */}
      <div style={{ marginTop: 40 }}>
        <h4>Топ учебных заведений</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.top_institutions} margin={{ bottom: 30 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="institution" />
            <YAxis label={{ value: 'Количество команд', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#10b981" maxBarSize={50} radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Участники по уровню и курсу */}
      <div style={{ marginTop: 40 }}>
        <h4>Участники по уровню и курсу</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Курс" />
            <YAxis type="number" dataKey="y" name="Количество участников" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend verticalAlign="top" height={40} />
            {Object.keys(levelColors).map(level => (
              <Scatter
                key={level}
                name={level}
                data={scatterData.filter(d => d.level === level)}
                fill={levelColors[level]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Партнёры */}
      <div style={{ marginTop: 40 }}>
        <h4>Топ партнёров</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.top_partners} margin={{ bottom: 30 }}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Количество кейсов', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="cases_count" fill="#10b981" maxBarSize={40} radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}