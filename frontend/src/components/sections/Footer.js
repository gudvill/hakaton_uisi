import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Хакатон 2025</h3>
            <p>Создаем технологии будущего вместе</p>
            <div className="social-links">
              <a href="#" aria-label="Telegram">📱</a>
              <a href="#" aria-label="YouTube">📺</a>
              <a href="#" aria-label="VK">🔗</a>
              <a href="#" aria-label="GitHub">💻</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Мероприятие</h4>
            <ul>
              <li><a href="#about">О хакатоне</a></li>
              <li><a href="#cases">Кейсы</a></li>
              <li><a href="#stats">Статистика</a></li>
              <li><Link to="/schedule">Расписание</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Участникам</h4>
            <ul>
              <li><Link to="/registration">Регистрация</Link></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link to="/rules">Правила</Link></li>
              <li><a href="#consultation">Поддержка</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Контакты</h4>
            <div className="contact-info">
              <p>📧 info@hackathon2025.ru</p>
              <p>📱 +7 (495) 123-45-67</p>
              <p>📍 Технопарк "Сколково", Москва</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; 2025 Хакатон. Все права защищены.</p>
            <div className="legal-links">
              <Link to="/privacy">Политика конфиденциальности</Link>
              <Link to="/terms">Пользовательское соглашение</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;