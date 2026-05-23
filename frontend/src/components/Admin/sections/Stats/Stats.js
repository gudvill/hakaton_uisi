import './Stats.css';
import { useEffect, useState, useMemo } from 'react';
import { getStats, getAnalytics, getVisitSessions, getTopPages, getDevices, getTrafficSources } from '../../../../api/statsService';
import { UserGroupIcon, UsersIcon, AcademicCapIcon, BookOpenIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line, ScatterChart, Scatter, } from 'recharts';

const CARDS_CONFIG = [
  { key: 'teams', label: 'Команд', Icon: UserGroupIcon, color: '#6a35cc', bg: '#f3f0ff' },
  { key: 'members', label: 'Участников', Icon: UsersIcon, color: '#3b82f6', bg: '#eff6ff' },
  { key: 'partners', label: 'Партнёров', Icon: BuildingOfficeIcon, color: '#6366f1', bg: '#eef2ff' },
  { key: 'cases', label: 'Кейсов', Icon: BookOpenIcon, color: '#f97316', bg: '#fff7ed' },
  { key: 'avg_team', label: 'Средний размер команды', Icon: UsersIcon, color: '#14b8a6', bg: '#f0fdfa' },
  { key: 'bachelor', label: 'Бакалавриат/Специалитет', Icon: AcademicCapIcon, color: '#10b981', bg: '#f0fdf4' },
  { key: 'master', label: 'Магистратура', Icon: BookOpenIcon, color: '#f59e0b', bg: '#fffbeb' },
  { key: 'spo9', label: 'СПО (после 9)', Icon: BuildingOfficeIcon, color: '#ec4899', bg: '#fdf2f8' },
  { key: 'spo11', label: 'СПО (после 11)', Icon: BuildingOfficeIcon, color: '#f43f5e', bg: '#fff1f2' },
];

const GRID_STROKE = '#ede8ff';
const AXIS_TICK = { fontSize: 11, fill: '#5c4d7a' };
const CHART_MARGIN = { top: 8, right: 12, bottom: 52, left: 8 };

function formatChartDate(value) {
  if (value == null || value === '') return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return '—';
  const s = Math.round(Number(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

function truncateLabel(value, max = 22) {
  if (value == null) return '';
  const s = String(value);
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function MetrikaTile({ title, rows, unit, loading, color }) {
  const max = rows[0]?.value || 1;
  return (
    <div className="metrika-tile">
      <div className="metrika-tile-title">{title}</div>
      {loading ? (
        <div className="metrika-tile-empty">Загрузка...</div>
      ) : rows.length === 0 ? (
        <div className="metrika-tile-empty">Нет данных</div>
      ) : (
        <ol className="metrika-tile-list">
          {rows.map((row, i) => (
            <li key={i} className="metrika-tile-row">
              <span className="metrika-tile-rank">{i + 1}</span>
              <div className="metrika-tile-bar-wrap">
                <div className="metrika-tile-label" title={row.name}>{row.name}</div>
                <div className="metrika-tile-bar-track">
                  <div
                    className="metrika-tile-bar-fill"
                    style={{ width: `${(row.value / max) * 100}%`, background: color }}
                  />
                </div>
              </div>
              <span className="metrika-tile-value">{row.value.toLocaleString('ru-RU')}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="metrika-tile-unit">{unit} · последние 30 дней</div>
    </div>
  );
}

function ChartCard({ title, description, scatter, badge, children }) {
  return (
    <section className="stats-chart-card">
      <header className="stats-chart-head">
        <div className="stats-chart-head-row">
          <h4 className="stats-chart-title">{title}</h4>
          {badge}
        </div>
        {description ? <p className="stats-chart-desc">{description}</p> : null}
      </header>
      <div className={scatter ? 'stats-chart-inner stats-chart-inner--scatter' : 'stats-chart-inner'}>{children}</div>
    </section>
  );
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="stats-tooltip" style={{ background: '#fff', padding: '10px 12px' }}>
      <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{row.level}</div>
      <div style={{ color: '#555', fontSize: 12 }}>Курс: {row.realCourse}</div>
      <div style={{ color: '#555', fontSize: 12 }}>Участников: {row.y}</div>
    </div>
  );
}

export default function Stats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [sessionsError, setSessionsError] = useState(null);
  const [topPages, setTopPages] = useState(null);
  const [devices, setDevices] = useState(null);
  const [sources, setSources] = useState(null);

  useEffect(() => {
    getStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch(console.error);
  }, []);

  useEffect(() => {
    getVisitSessions()
      .then((res) => { setSessions(res); setSessionsError(null); })
      .catch((err) => {
        console.error('sessions error:', err);
        setSessionsError(err?.response?.data?.detail || err?.message || 'Ошибка загрузки');
        setSessions({});
      });
  }, []);

  useEffect(() => {
    getTopPages().then(setTopPages).catch((e) => { console.error(e); setTopPages({}); });
    getDevices().then(setDevices).catch((e) => { console.error(e); setDevices({}); });
    getTrafficSources().then(setSources).catch((e) => { console.error(e); setSources({}); });
  }, []);

  const yearData = useMemo(() => (Array.isArray(data?.teams_by_year) ? data.teams_by_year : []), [data]);
  const registrationsData = useMemo(
    () => (Array.isArray(data?.registrations_dynamics) ? data.registrations_dynamics : []),
    [data]
  );
  const participationData = useMemo(
    () => (Array.isArray(data?.participation_forms) ? data.participation_forms : []),
    [data]
  );
  const topInstitutions = useMemo(
    () => (Array.isArray(data?.top_institutions) ? data.top_institutions : []),
    [data]
  );
  const topPartners = useMemo(() => (Array.isArray(data?.top_partners) ? data.top_partners : []), [data]);

  const metrikaData = useMemo(() => {
    return analytics?.data?.map((item) => ({
      date: item.dimensions?.[0]?.name,
      visits: item.metrics?.[0] || 0,
      views: item.metrics?.[1] || 0,
      avgDuration: item.metrics?.[2] ?? null,
      pageDepth: item.metrics?.[3] ?? null,
    })) || [];
  }, [analytics]);

  const metrikaTotals = useMemo(() => {
    if (!metrikaData.length) return null;
    const totalVisits = metrikaData.reduce((s, d) => s + d.visits, 0);
    const totalViews = metrikaData.reduce((s, d) => s + d.views, 0);
    const peakDay = metrikaData.reduce((best, d) => (d.visits > best.visits ? d : best), metrikaData[0]);
    return { totalVisits, totalViews, peakDay, days: metrikaData.length };
  }, [metrikaData]);

  const parseRankedList = (raw) =>
    (raw?.data ?? []).map((item) => ({
      name: item.dimensions?.[0]?.name ?? '—',
      value: item.metrics?.[0] ?? 0,
    }));

  const topPagesRows = useMemo(() => parseRankedList(topPages), [topPages]);
  const devicesRows = useMemo(() => parseRankedList(devices), [devices]);
  const sourcesRows = useMemo(() => parseRankedList(sources), [sources]);

  const sessionRows = useMemo(() => {
    return sessions?.data?.map((item) => {
      const rawDate = item.dimensions?.[0]?.name ?? '';
      const startURL = item.dimensions?.[1]?.name ?? '';
      const endURL = item.dimensions?.[2]?.name ?? '';
      const duration = item.metrics?.[0] ?? null;
      const pageDepth = item.metrics?.[1] ?? null;
      return { rawDate, startURL, endURL, duration, pageDepth };
    }) ?? [];
  }, [sessions]);

  const scatterData = useMemo(() => {
    const m = data?.participants_matrix;
    if (!m || typeof m !== 'object') return [];
    const levelOffsets = {
      'бакалавриат/специалитет': -0.15,
      магистратура: -0.05,
      'спо 9класс': 0.05,
      'спо 11класс': 0.15,
    };
    const collisionMap = {};
    Object.entries(m).forEach(([level, courses]) => {
      Object.entries(courses || {}).forEach(([course, count]) => {
        const key = `${course}_${count}`;
        if (!collisionMap[key]) collisionMap[key] = [];
        collisionMap[key].push(level);
      });
    });
    const out = [];
    Object.entries(m).forEach(([level, courses]) => {
      Object.entries(courses || {}).forEach(([course, count]) => {
        const key = `${course}_${count}`;
        const hasCollision = collisionMap[key].length > 1;
        out.push({
          level,
          x: Number(course) + (hasCollision ? (levelOffsets[level] || 0) : 0),
          y: count,
          realCourse: Number(course),
        });
      });
    });
    return out;
  }, [data]);

  const levelColors = {
    'бакалавриат/специалитет': '#10b981',
    магистратура: '#f59e0b',
    'спо 9класс': '#3b82f6',
    'спо 11класс': '#f43f5e',
  };

  const tooltipStyle = {
    borderRadius: 10,
    border: '1px solid #ede8ff',
    boxShadow: '0 8px 24px rgba(59, 31, 168, 0.12)',
  };

  if (loading) return <p className="participants-loading">Загрузка...</p>;
  if (!data) return <p className="section-empty">Не удалось загрузить статистику</p>;

  const matrix = data.participants_matrix || {};

  const sumLevel = (level) =>
    matrix[level] ? Object.values(matrix[level]).reduce((a, b) => a + b, 0) : 0;

  const values = {
    teams: data.totals?.teams || 0,
    members: data.totals?.participants || 0,
    partners: data.totals?.partners || 0,
    cases: data.totals?.cases || 0,
    avg_team: data.totals?.avg_team_size || 0,
    bachelor: sumLevel('бакалавриат/специалитет'),
    master: sumLevel('магистратура'),
    spo9: sumLevel('спо 9класс'),
    spo11: sumLevel('спо 11класс'),
  };

  return (
    <div className="admin-card stats-page">
      <h3 className="admin-card-title">СТАТИСТИКА</h3>

      <div className="stats-grid">
        {CARDS_CONFIG.map(({ key, label, Icon, color, bg }) => (
          <div key={key} className="stat-card" style={{ background: bg }}>
            <div className="stat-icon-wrap" style={{ background: color }}>
              <Icon style={{ width: 22, height: 22, color: 'white' }} />
            </div>
            <span className="stat-value" style={{ color }}>
              {values[key]}
            </span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="stats-charts">
        <ChartCard title="Команды по годам" description="Регистрации команд по году создания записи.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsBarTeams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9b7df0" />
                  <stop offset="100%" stopColor="#6a35cc" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="year"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                label={{ value: 'Год', position: 'insideBottom', offset: -36, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                width={44}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Команд', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(106, 53, 204, 0.06)' }} />
              <Bar dataKey="count" fill="url(#statsBarTeams)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Динамика регистраций" description="Число новых регистраций по календарным датам.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationsData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsLineReg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6a35cc" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                tickFormatter={formatChartDate}
                interval="preserveStartEnd"
                minTickGap={28}
                label={{ value: 'Дата', position: 'insideBottom', offset: -36, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                width={44}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Регистраций', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip labelFormatter={(v) => formatChartDate(v)} contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#statsLineReg)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6a35cc', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#6a35cc', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Форма участия" description="Распределение команд по формату участия.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsBarForm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="participation_form"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                tickFormatter={(v) => truncateLabel(v, 14)}
                label={{ value: 'Форма', position: 'insideBottom', offset: -36, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                width={44}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Команд', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
              <Bar dataKey="count" fill="url(#statsBarForm)" maxBarSize={52} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Топ учебных заведений" description="До 10 учреждений с наибольшим числом зарегистрированных команд.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topInstitutions} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsBarInst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="institution"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                tickFormatter={(v) => truncateLabel(v, 16)}
                interval={0}
                angle={-22}
                textAnchor="end"
                height={72}
              />
              <YAxis
                width={44}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Команд', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
              <Bar dataKey="count" fill="url(#statsBarInst)" maxBarSize={48} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          scatter
          title="Участники по уровню и курсу"
          description="Точка: курс (ось X) и число участников (ось Y). Цвет — уровень образования."
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, bottom: 44, left: 8 }}>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[0.5, 5.5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => Math.round(value)}
                allowDecimals={false}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                label={{ value: 'Курс', position: 'insideBottom', offset: -28, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                width={52}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Участников', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend
                verticalAlign="top"
                align="right"
                layout="vertical"
                wrapperStyle={{ fontSize: 11, color: '#5c4d7a', paddingBottom: 8 }}
              />
              {Object.keys(levelColors).map((level) => (
                <Scatter
                  shape="circle"
                  fillOpacity={0.88}
                  line={false}
                  key={level}
                  name={level}
                  data={scatterData.filter((d) => d.level === level)}
                  fill={levelColors[level]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Топ партнёров" description="Число кейсов, привязанных к каждому партнёру.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPartners} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsBarPartners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                tickFormatter={(v) => truncateLabel(v, 14)}
                angle={-20}
                textAnchor="end"
                height={64}
              />
              <YAxis
                width={44}
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Кейсов', angle: -90, position: 'insideLeft', dx: 10, fill: '#6a35cc', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(22, 163, 74, 0.08)' }} />
              <Bar dataKey="cases_count" fill="url(#statsBarPartners)" maxBarSize={44} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="metrika-divider">
        <div className="metrika-divider-line" />
        <div className="metrika-divider-label">
          Метрики
        </div>
        <div className="metrika-divider-line" />
      </div>

      <div className="metrika-tiles">
        <MetrikaTile
          title="Популярные страницы"
          unit="просм."
          rows={topPagesRows}
          loading={topPages === null}
          color="#c96a00"
        />
        <MetrikaTile
          title="Устройства"
          unit="визитов"
          rows={devicesRows}
          loading={devices === null}
          color="#c96a00"
        />
        <MetrikaTile
          title="Источники трафика"
          unit="визитов"
          rows={sourcesRows}
          loading={sources === null}
          color="#c96a00"
        />
      </div>

      {metrikaTotals && (
        <div className="metrika-kpis">
          <div className="metrika-kpi-card">
            <span className="metrika-kpi-value">{metrikaTotals.totalVisits.toLocaleString('ru-RU')}</span>
            <span className="metrika-kpi-label">Посещений за период</span>
          </div>
          <div className="metrika-kpi-card">
            <span className="metrika-kpi-value">{metrikaTotals.totalViews.toLocaleString('ru-RU')}</span>
            <span className="metrika-kpi-label">Просмотров за период</span>
          </div>
          <div className="metrika-kpi-card">
            <span className="metrika-kpi-value">
              {metrikaTotals.days > 0
                ? Math.round(metrikaTotals.totalVisits / metrikaTotals.days).toLocaleString('ru-RU')
                : '—'}
            </span>
            <span className="metrika-kpi-label">Визитов в день (среднее)</span>
          </div>
          <div className="metrika-kpi-card">
            <span className="metrika-kpi-value">
              {metrikaTotals.peakDay ? formatChartDate(metrikaTotals.peakDay.date) : '—'}
            </span>
            <span className="metrika-kpi-label">
              Пиковый день&nbsp;
              <span className="metrika-kpi-peak">({metrikaTotals.peakDay?.visits ?? 0} визитов)</span>
            </span>
          </div>
        </div>
      )}

      <div className="stats-charts stats-charts--metrika">
        <ChartCard
          title="Динамика посещаемости"
          description="Посещения и просмотры страниц по дням за последние 30 дней."
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrikaData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="statsVisits" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff9500" />
                  <stop offset="100%" stopColor="#e05d00" />
                </linearGradient>
                <linearGradient id="statsViews" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffcc00" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#fff0d6" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#7a4e1a' }}
                tickLine={false}
                axisLine={{ stroke: '#ffe0a0' }}
                tickFormatter={formatChartDate}
                interval="preserveStartEnd"
                minTickGap={28}
                label={{ value: 'Дата', position: 'insideBottom', offset: -36, fill: '#c96a00', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                width={44}
                tick={{ fontSize: 11, fill: '#7a4e1a' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: 'Количество', angle: -90, position: 'insideLeft', dx: 10, fill: '#c96a00', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                labelFormatter={(v) => formatChartDate(v)}
                contentStyle={{ borderRadius: 10, border: '1px solid #ffe0a0', boxShadow: '0 8px 24px rgba(200,100,0,0.12)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="visits" name="Посещения" stroke="url(#statsVisits)" strokeWidth={3} dot={{ r: 3, fill: '#e05d00', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#e05d00', stroke: '#fff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="views" name="Просмотры" stroke="url(#statsViews)" strokeWidth={3} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="metrika-table-wrap">
        <div className="metrika-table-header">
          Визиты за последние 7 дней
        </div>
        {sessions === null ? (
          <p className="metrika-table-empty">Загрузка...</p>
        ) : sessionsError ? (
          <p className="metrika-table-empty metrika-table-error">{sessionsError}</p>
        ) : sessionRows.length === 0 ? (
          <p className="metrika-table-empty">Нет данных за период</p>
        ) : (
          <div className="metrika-table-scroll">
            <table className="metrika-table">
              <thead>
                <tr>
                  <th>Дата и время</th>
                  <th>Время на сайте</th>
                  <th>Страниц</th>
                  <th>Страница входа</th>
                  <th>Страница выхода</th>
                </tr>
              </thead>
              <tbody>
                {sessionRows.map((row, i) => {
                  const d = new Date(row.rawDate);
                  const dateStr = Number.isNaN(d.getTime())
                    ? row.rawDate
                    : d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  const getPath = (url) => {
                    try { return new URL(url).pathname || '/'; } catch { return url; }
                  };
                  const sameURL = row.startURL === row.endURL;
                  return (
                    <tr key={i}>
                      <td className="metrika-td-date">{dateStr}</td>
                      <td className="metrika-td-duration">{formatDuration(row.duration)}</td>
                      <td className="metrika-td-depth">
                        {row.pageDepth != null ? Math.round(row.pageDepth) : '—'}
                      </td>
                      <td className="metrika-td-url" title={row.startURL}>
                        {row.startURL ? getPath(row.startURL) : '—'}
                      </td>
                      <td className="metrika-td-url" title={row.endURL}>
                        {sameURL
                          ? <span className="metrika-same-page">= вход</span>
                          : (row.endURL ? getPath(row.endURL) : '—')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
