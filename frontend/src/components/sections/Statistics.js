import React from 'react';
import './Statistics.css';

const Statistics = () => {
  const stats = [
    {
      number: "1000+",
      label: "Участников",
      description: "Разработчиков и дизайнеров"
    },
    {
      number: "50+",
      label: "Команд",
      description: "Из разных городов"
    },
    {
      number: "100+",
      label: "Проектов",
      description: "Инновационных решений"
    },
    {
      number: "5M₽",
      label: "Призовой фонд",
      description: "Для победителей"
    }
  ];

  return (
    <section className="statistics" id="stats">
      <div className="container">
        <h2 className="section-title">Статистика</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;