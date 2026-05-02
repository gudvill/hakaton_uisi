import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById } from '../../api/newsService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './NewsDetailPage.css';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getNewsById(id)
      .then(setItem)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Функция форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <Header />
      <main className="news-detail container">
        <Link className="news-detail__back" to="/news">← Все новости</Link>
        {loading && <p className="news-detail__loading">Загрузка...</p>}
        {error && <p className="news-detail__error">Новость не найдена.</p>}
        {item && (
          <article className="news-detail__article">
            <p className="news-detail__date">{formatDate(item.created_at)}</p>
            <h1 className="news-detail__title">{item.name}</h1>
            {/* src={item.image} — тот путь, который указан в БД */}
            {item.image && (
              <img className="news-detail__img" src={`${API_URL}${item.image}`} alt={item.name} />
            )}
            <div className="news-detail__content">
              {item.full_description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
