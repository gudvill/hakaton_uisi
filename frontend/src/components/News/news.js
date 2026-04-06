import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../../api/newsService'; 
import './news.css';

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews()
      .then(data => setNews(data))
      .catch(err => console.error("Ошибка загрузки новостей:", err));
  }, []);

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
    <section className="news container" id="news">
      <div className="news-header">
        <h2>НОВОСТИ</h2>
      </div>

      <div className="news-grid">
        {news.slice(0, 4).map((item) => (
          <div key={item.id} className="news-card-wrapper">
            <Link className="news-card" to={`/news/${item.id}`}>
              <div className="news-card__img-wrap">
                <img className="news-card__img" src={item.image} alt={item.name} />
              </div>
              <div className="news-card__body">
                <p className="news-card__date">{formatDate(item.created_at)}</p>
                <p className="news-card__title">{item.name}</p>
                <p className="news-card__text">{item.brief_description}</p>
                <span className="news-card__link">перейти →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Link className="news-all-link" to="/news">
        все новости <img src="images/arrow_white.svg" alt="стрелка" />
      </Link>
    </section>
  );
}
