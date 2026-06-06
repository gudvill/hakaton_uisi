import './cases.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCases } from '../../api/casesService';
import FadeIn from '../FadeIn/FadeIn';

const getLevelModifier = (level) => {
  const value = (level || '').toLowerCase();
  if (value.includes('старт')) return 'case_card--starter';
  if (value.includes('продвин')) return 'case_card--advanced';
  return '';
};

const formatCaseNumber = (num) => {
  if (num == null || num === '') return '';
  return String(num).padStart(2, '0');
};

export default function Cases() {
  const [casesData, setCasesData] = useState([]);

  useEffect(() => {
    getCases()
      .then(data => setCasesData(data))
      .catch(err => console.error('Ошибка загрузки кейсов:', err));
  }, []);

  return (
    <section id="cases" className="cases container">
      <FadeIn variant="fadeUp">
        <h2>КЕЙСЫ</h2>
      </FadeIn>
      <div className="cases_container">
        {casesData.map((caseItem, i) => (
          <motion.a
            className={`case_card ${getLevelModifier(caseItem.level)}`}
            key={caseItem.id}
            href={`/case/${caseItem.id}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h3 className="case_header">{caseItem.name}</h3>
            <span className="level">{caseItem.level}</span>
            <p className="partner_name">{caseItem.partner_name || 'Без партнёра'}</p>
            <p className="case_number">{formatCaseNumber(caseItem.case_number)}</p>
          </motion.a>
        ))}
        <motion.div
          className="info-baner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="info-text">
            <p><span className="info-level--starter">Стартовый уровень</span> — для студентов 1-2 курсов.</p>
            <p><span className="info-level--advanced">Продвинутый уровень</span> — для студентов 3-5 курса и студентов магистратуры.</p>
            <Link to='/old-cases' className='cases-button'>кейсы прошлых лет <img src='images/black_arrow.svg'></img></Link>
          </div>
          <div className="info-image">
            <img src="images/computer.png" alt="компьютер" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
