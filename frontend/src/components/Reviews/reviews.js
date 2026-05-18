import './reviews.css';
import { useEffect, useState } from 'react';
import { getReviews } from '../../api/reviewsService';

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
      <h2>ОТЗЫВЫ</h2>
      <div className="reviews-grid">
        {reviewsData.slice(0, 3).map((review) => (
          <div
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
          >
            <img className="folder-back" src="/images/papka_back.svg" alt="" />
            <img className="folder-photo" src={`${API_URL}${review.image}`} alt="фото отзыва"/>
            <img className="folder-front" src="/images/papka_front.svg" alt="" />
            <div className="folder-body">
              {review.name ? <p className="folder-title">{review.name}</p> : null}
              <p className="folder-text">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
