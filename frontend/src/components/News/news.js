import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews } from '../../api/newsService';
import FadeIn from '../FadeIn/FadeIn';
import './news.css';

export default function News() {
  const [news, setNews] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getNews()
      .then(data => setNews(data))
      .catch(err => console.error("Ошибка загрузки новостей:", err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <section className="news container" id="news">
      <FadeIn variant="fadeUp">
        <div className="news-header">
          <h2>НОВОСТИ</h2>
        </div>
      </FadeIn>
      <div className="news-grid">
        {news.slice(0, 4).map((item, i) => (
          <motion.div
            key={item.id}
            className="news-card-wrapper"
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: Math.min(i, 3) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link className="news-card" to={`/news/${item.id}`}>
              <div className="news-card__img-wrap">
                <img className="news-card__img" src={`${API_URL}${item.image}`} alt={item.name} />
              </div>
              <div className="news-card__body">
                <p className="news-card__date">{formatDate(item.created_at)}</p>
                <p className="news-card__title">{item.name}</p>
                <p className="news-card__text">{item.brief_description}</p>
                <span className="news-card__link">перейти →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <FadeIn variant="fadeUp" delay={0.2}>
        <Link className="news-all-link" to="/news">
          все новости <img src="images/arrow_white.svg" alt="стрелка" />
        </Link>
      </FadeIn>
    </section>
  );
}
