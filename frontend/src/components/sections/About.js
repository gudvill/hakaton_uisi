import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <h2 className="section-title">О мероприятии</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Хакатон 2025 — это крупнейшее технологическое событие года,
              где участники создают инновационные решения для реальных проблем.
            </p>
            <div className="about-details">
              <div className="detail-item">
                <h4>Когда</h4>
                <p>15-17 марта 2025</p>
              </div>
              <div className="detail-item">
                <h4>Где</h4>
                <p>Технопарк "Сколково", Москва</p>
              </div>
              <div className="detail-item">
                <h4>Формат</h4>
                <p>Очно + онлайн трансляция</p>
              </div>
            </div>
          </div>
          <div className="about-features">
            <div className="feature">
              <h4>💡 Инновации</h4>
              <p>Разработка передовых технологических решений</p>
            </div>
            <div className="feature">
              <h4>🤝 Нетворкинг</h4>
              <p>Знакомство с профессионалами отрасли</p>
            </div>
            <div className="feature">
              <h4>🏆 Призы</h4>
              <p>Ценные призы и инвестиции в проекты</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;