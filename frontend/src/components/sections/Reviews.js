import React from 'react';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    {
      name: "Анна Петрова",
      role: "Frontend Developer",
      company: "Яндекс",
      text: "Хакатон дал мне невероятный опыт работы в команде и возможность реализовать смелые идеи!",
      avatar: "/images/avatar1.jpg"
    },
    {
      name: "Михаил Сидоров",
      role: "Backend Developer",
      company: "Сбер",
      text: "Отличная организация, интересные задачи и возможность познакомиться с единомышленниками.",
      avatar: "/images/avatar2.jpg"
    },
    {
      name: "Елена Козлова",
      role: "UX/UI Designer",
      company: "МТС",
      text: "Креативная атмосфера, профессиональные менторы и ценные призы. Обязательно приму участие снова!",
      avatar: "/images/avatar3.jpg"
    }
  ];

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <h2 className="section-title">Отзывы участников</h2>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-content">
                <p className="review-text">"{review.text}"</p>
              </div>
              <div className="review-author">
                <img src={review.avatar} alt={review.name} className="author-avatar" />
                <div className="author-info">
                  <h4 className="author-name">{review.name}</h4>
                  <p className="author-role">{review.role}</p>
                  <p className="author-company">{review.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;