import { useEffect, useState, useMemo } from 'react';
import { getArchivedCases } from '../../api/casesService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './cases.css';
import './CasesArchivePage.css';

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

export default function CasesArchivePage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(null);

  useEffect(() => {
    getArchivedCases()
      .then(setCases)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getYear = (c) => c.year || new Date(c.created_at).getFullYear();

  const years = useMemo(() => {
    const set = new Set(cases.map(getYear));
    return [...set].filter(Boolean).sort((a, b) => b - a);
  }, [cases]);

  const filtered = useMemo(() => {
    if (!activeYear) return cases;
    return cases.filter(c => getYear(c) === activeYear);
  }, [cases, activeYear]);

  return (
    <>
      <Header />
      <main className="cases-archive container">
        <div className="cases-archive__header">
          <h2 className='archive-title'>КЕЙСЫ ПРОШЛЫХ ЛЕТ</h2>
          {!loading && years.length > 0 && (
            <div className="cases-archive__years">
              <button
                className={`cases-archive__year-btn ${activeYear === null ? 'cases-archive__year-btn--active' : ''}`}
                onClick={() => setActiveYear(null)}
              >
                Все
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`cases-archive__year-btn ${activeYear === year ? 'cases-archive__year-btn--active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="cases-archive__status">Загрузка...</p>
        ) : filtered.length === 0 ? (
          <p className="cases-archive__status">Кейсы не найдены.</p>
        ) : (
          <div className="cases_container">
            {filtered.map((caseItem) => (
              <a
                key={caseItem.id}
                className={`case_card ${getLevelModifier(caseItem.level)}`}
                href={`/case/${caseItem.id}`}
              >
                <h3 className="case_header">{caseItem.name}</h3>
                <span className="level">{caseItem.level}</span>
                <p className="partner_name">{caseItem.partner_name || 'Без партнёра'}</p>
                <p className="case_number">{formatCaseNumber(caseItem.case_number)}</p>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
