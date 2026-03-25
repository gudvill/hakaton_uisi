import './cases.css';
import { useEffect, useState } from 'react';
import { getCases } from '../../api/casesService';

export default function Cases() {
  const [casesData, setCasesData] = useState([]);

  useEffect(() => {
    getCases()
      .then(data => setCasesData(data))
      .catch(err => console.error("Ошибка загрузки кейсов:", err));
  }, []);

  return (
    <section className="cases container">
      <h2>КЕЙСЫ</h2>
      <div className='cases_container'>
        {casesData.map((caseItem) => (
          <a className='case_card' key={caseItem.id} href={`/case/${caseItem.id}`}>
            <h3 className='case_header'>{caseItem.name}</h3>
            <span className='level'>{caseItem.level}</span>
            <p className='partner_name'>{caseItem.partner_name || "Без партнёра"}</p>
            <p className='case_number'>{caseItem.case_number}</p>
          </a>
        ))}
        <div className='info-baner'>
          <div className='info-text'>
            <p>Стартовый уровень - для студентов 1-2 курсов.</p>
            <p>Продвинутый уровень - для студентов 3-5 курса и студентов магистратуры.</p>
          </div>
          <div className='info-image'>
              <img src='images/computer.png'></img>
          </div>
        </div>
      </div>
    </section>
  );
}
