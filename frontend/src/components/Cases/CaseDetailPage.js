import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCaseById } from '../../api/casesService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './CaseDetailPage.css';

export default function CaseDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCaseById(id)
      .then(data => {
        setItem(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main className="case-detail container">
        {loading && <p className="case-detail__loading">Загрузка...</p>}
        {error && <p className="case-detail__error">Кейс не найден.</p>}

        {item && (
          <article className="case-detail__article">

            <div className="case-detail__top">
              <div className="case-detail__top-left">
                <div className="case-detail__heading-row">
                  <h1 className="case-detail__number">
                    КЕЙС {String(item.case_number).padStart(2, '0')}
                  </h1>
                  {item.level && (
                    <span className="case-detail__level">{item.level}</span>
                  )}
                </div>

                <p className="case-detail__name">{item.name}</p>

                <div className="case-detail__teams">
                  <span className="case-detail__teams-badge">КОМАНД: 0 / 10</span>
                </div>
              </div>

              {item.partner_name && (
                <div className="case-detail__partner-card">
                    <img src={item.partner_image} alt={item.partner_name} className="case-detail__partner-img" />
                  <span className="case-detail__partner-name">{item.partner_name}</span>
                </div>
              )}
            </div>

            <div className="case-detail__divider" />

            {/* Описание + картинка */}
            <div className="case-detail__content">
              {item.description && (
                <div className="case-detail__body">
                  <p className='knowledge'>Необходимые знания:</p>
                  {item.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              <div className="case-detail__image-block">
                <img src="/images/virus.svg" alt="" className="case-detail__image" />
              </div>
            </div>

          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
