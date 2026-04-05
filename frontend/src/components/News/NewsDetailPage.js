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

  useEffect(() => {
    getNewsById(id)
      .then(setItem)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main className="news-detail container">
        <Link className="news-detail__back" to="/news">← Все новости</Link>
        {loading && <p className="news-detail__loading">Загрузка...</p>}
        {error && <p className="news-detail__error">Новость не найдена.</p>}
        {item && (
          <article className="news-detail__article">
            <p className="news-detail__date">{item.date}</p>
            <h1 className="news-detail__title">{item.title}</h1>
            {item.image && (
              <img className="news-detail__img" src={item.image} alt={item.title} />
            )}
            <div className="news-detail__content">
              {item.content.split('\n').map((line, i) => (
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
