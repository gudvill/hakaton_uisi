import { useState, useEffect } from 'react';
import { getAbout } from '../../api/aboutService';
import './about.css';

export default function About() {
  // row: 1-3, col: 1-3
  const [steps, setSteps] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getAbout()
      .then(data => setSteps(data))
      .catch(err => console.error("Ошибка загрузки этапов:", err));
  }, []);

  const orderedSteps = [...steps].sort(
    (a, b) => a.row - b.row || a.col - b.col
  );

  return (
    <section id="hakaton" className="about container">
      <h2>О ХАКАТОНЕ</h2>
      <div className='text-about'>
        <p>Это короткое командное мероприятие, в ходе которого за ограниченное время участники создают или улучшают проекты, разрабатывают идеи и представляют готовые решения.</p>
      </div>
      <div className="roadmap">

        {/* Градиентная линия-змейка
            Ряды по 300px → центры строк: y=150, 450, 750
            Колонки 1/3 → центры: x=200, 600, 1000 (viewBox 0 0 1200 900)
            Дуги: r=150 ((450-150)/2=150)                               */}
        <svg
          className="roadmap-svg"
          viewBox="0 0 1200 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#A558F8" />
              <stop offset="100%" stopColor="#2055C7" />
            </linearGradient>
          </defs>
          <path
            d="M 200,150 H 1050 A 50,50 0 0,1 1100,200 V 400 A 50,50 0 0,1 1050,450 H 150 A 50,50 0 0,0 100,500 V 700 A 50,50 0 0,0 150,750 H 600"
            stroke="url(#snakeGrad)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div className="roadmap-grid">
          {orderedSteps.map((s) => (
            <div
              key={s.id}
              className="roadmap-cell"
              style={{ gridRow: s.row, gridColumn: s.col }}
            >
              <div className="roadmap-circle"><img src={`${API_URL}${s.icon}`} alt={s.title} /></div>
              <div className="roadmap-label">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
