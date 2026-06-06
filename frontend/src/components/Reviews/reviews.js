import './reviews.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getReviews } from '../../api/reviewsService';
import FadeIn from '../FadeIn/FadeIn';

const directions = [
  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, y: 50 },  visible: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: 50 },  visible: { opacity: 1, x: 0 } },
];

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);
  const [openReviewId, setOpenReviewId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getReviews()
      .then(data => setReviewsData(data))
      .catch(err => console.error("Ошибка загрузки отзывов:", err));
  }, []);

  const toggleFolder = (id) => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    setOpenReviewId((current) => (current === id ? null : id));
  };

  return (
    <section className="reviews container">
      <FadeIn variant="fadeUp">
        <h2>ОТЗЫВЫ</h2>
      </FadeIn>
      <div className="reviews-grid">
        {reviewsData.slice(0, 3).map((review, i) => (
          <motion.div
            className={`folder-card${openReviewId === review.id ? ' is-open' : ''}`}
            key={review.id}
            role="button"
            tabIndex={0}
            aria-expanded={openReviewId === review.id}
            onClick={() => toggleFolder(review.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFolder(review.id);
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={directions[i % 3]}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img className="folder-back" src="/images/papka_back.svg" alt="" />
            <img className="folder-photo" src={`${API_URL}${review.image}`} alt="фото отзыва" />
            <img className="folder-front" src="/images/papka_front.svg" alt="" />
            <div className="folder-body">
              {review.name ? <p className="folder-title">{review.name}</p> : null}
              <p className="folder-text">{review.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
