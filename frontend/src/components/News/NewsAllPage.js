import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../../api/newsService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './NewsAllPage.css';

export default function NewsAllPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="news-all container">
        <h2>НОВОСТИ</h2>
        {loading ? (
          <p className="news-all__loading">Загрузка...</p>
        ) : (
          <div className="news-all__grid">
            {news.map((item) => (
              <Link key={item.id} className="news-card" to={`/news/${item.id}`}>
                <div className="news-card__img-wrap">
                  <img className="news-card__img" src={item.image} alt={item.title} />
                </div>
                <div className="news-card__body">
                  <p className="news-card__date">{item.date}</p>
                  <p className="news-card__title">{item.title}</p>
                  <p className="news-card__text">{item.preview}</p>
                  <span className="news-card__link">перейти →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
