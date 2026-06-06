import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAbout } from '../../api/aboutService';
import FadeIn from '../FadeIn/FadeIn';
import './about.css';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cellVariant = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function About() {
  const [steps, setSteps] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getAbout()
      .then(data => setSteps(data))
      .catch(err => console.error("Ошибка загрузки этапов:", err));
  }, []);

  const orderedSteps = [...steps].sort((a, b) => a.order_index - b.order_index);

  const getGridPosition = (orderIndex) => {
    const row = Math.ceil(orderIndex / 3);
    const col = ((orderIndex - 1) % 3) + 1;
    return { gridRow: row, gridColumn: col };
  };

  return (
    <section id="hakaton" className="about container">
      <FadeIn variant="fadeUp">
        <h2>О ХАКАТОНЕ</h2>
        <div className='text-about'>
          <p>Это короткое командное мероприятие, в ходе которого за ограниченное время участники создают или улучшают проекты, разрабатывают идеи и представляют готовые решения.</p>
        </div>
      </FadeIn>
      <div className="roadmap">
        <FadeIn variant="fadeIn" duration={0.8}>
          <svg
            className="roadmap-svg"
            viewBox="0 0 1200 900"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A558F8" />
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
        </FadeIn>
        <motion.div
          className="roadmap-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {orderedSteps.map((s) => (
            <motion.div
              key={s.id}
              className="roadmap-cell"
              style={getGridPosition(s.order_index)}
              variants={cellVariant}
            >
              <div className="roadmap-circle"><img src={`${API_URL}${s.icon}`} alt={s.title} /></div>
              <div className="roadmap-label">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
