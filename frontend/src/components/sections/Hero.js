import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Хакатон 2025
            <span className="highlight">Инновации будущего</span>
          </h1>
          <p className="hero-description">
            Присоединяйтесь к крупнейшему хакатону года!
            Создавайте решения, которые изменят мир.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary">Регистрация</button>
            <button className="btn btn-secondary">Узнать больше</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/background_rose.png" alt="Хакатон" />
        </div>
      </div>
    </section>
  );
};

export default Hero;