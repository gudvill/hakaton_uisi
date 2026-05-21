import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById, getNews } from '../../api/newsService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './NewsDetailPage.css';
import './news.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getNewsById(id),
      getNews()
    ])
      .then(([newsItem, allNews]) => {
        setItem(newsItem);
        setOthers(allNews.filter(n => String(n.id) !== String(id)).slice(0, 4));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main className="news-detail container">
        {loading && <p className="news-detail__loading">Загрузка...</p>}
        {error && <p className="news-detail__error">Новость не найдена.</p>}

        {item && (
          <>
            <article className="news-detail__article">
              <div className="news-detail__top">
                {item.image && (
                  <img
                    className="news-detail__img"
                    src={`${API_URL}${item.image}`}
                    alt={item.name}
                  />
                )}
                <div className="news-detail__intro">
                  <p className="news-detail__date">{formatDate(item.created_at)}</p>
                  <h1 className="news-detail__title">{item.name}</h1>
                  {item.brief_description && (
                    <p className="news-detail__brief">{item.brief_description}</p>
                  )}
                </div>
              </div>

              <div className="news-detail__content">
                {item.full_description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </article>

            {others.length > 0 && (
              <section className="news-detail__others">
                <h2 className="news-detail__others-title">ДРУГИЕ НОВОСТИ</h2>
                <div className="news-grid">
                  {others.map(n => (
                    <div key={n.id} className="news-card-wrapper">
                      <Link className="news-card" to={`/news/${n.id}`}>
                        <div className="news-card__img-wrap">
                          <img className="news-card__img" src={`${API_URL}${n.image}`} alt={n.name} />
                        </div>
                        <div className="news-card__body">
                          <p className="news-card__date">{formatDate(n.created_at)}</p>
                          <p className="news-card__title">{n.name}</p>
                          <p className="news-card__text">{n.brief_description}</p>
                          <span className="news-card__link">перейти →</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
