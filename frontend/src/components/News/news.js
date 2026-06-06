import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNews } from '../../api/newsService';
import FadeIn from '../FadeIn/FadeIn';
import './news.css';

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

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
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <section className="news container" id="news">
      <FadeIn variant="fadeUp">
        <div className="news-header">
          <h2>НОВОСТИ</h2>
        </div>
      </FadeIn>
      <motion.div
        className="news-grid"
        variants={gridContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {news.slice(0, 4).map((item) => (
          <motion.div key={item.id} className="news-card-wrapper" variants={cardVariant}>
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
      </motion.div>
      <FadeIn variant="fadeUp" delay={0.2}>
        <Link className="news-all-link" to="/news">
          все новости <img src="images/arrow_white.svg" alt="стрелка" />
        </Link>
      </FadeIn>
    </section>
  );
}
