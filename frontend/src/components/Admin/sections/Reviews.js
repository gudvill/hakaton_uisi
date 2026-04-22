import '../../Reviews/reviews.css';
import { useEffect, useState } from 'react';
import { getReviews } from '../../../api/reviewsService';

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    getReviews()
      .then(data => setReviewsData(data))
      .catch(err => console.error("Ошибка загрузки отзывов:", err));
  }, []);

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ОТЗЫВЫ</h3>
      <div className="reviews-grid">
        {reviewsData.map((review) => (
          <div className="folder-card" key={review.id}>
            <img className="folder-back" src="/images/papka_back.svg" alt="" />
            <img className="folder-photo" src={review.image} alt="фото отзыва"/>
            <img className="folder-front" src="/images/papka_front.svg" alt="" />
            <p className="folder-text">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
