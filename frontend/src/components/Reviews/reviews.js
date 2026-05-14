import './reviews.css';
import { useEffect, useState } from 'react';
import { getReviews } from '../../api/reviewsService';

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getReviews()
      .then(data => setReviewsData(data))
      .catch(err => console.error("Ошибка загрузки отзывов:", err));
  }, []);

  return (
    <section className="reviews container">
      <h2>ОТЗЫВЫ</h2>
      <div className="reviews-grid">
        {reviewsData.slice(0, 3).map((review) => (
          <div className="folder-card" key={review.id}>
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
