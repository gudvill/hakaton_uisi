import { useState, useEffect } from 'react';
import './CookieNotice.css';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-notice">
      <button
        className="cookie-notice-close"
        onClick={handleClose}
        aria-label="Закрыть"
      >
        ✕
      </button>

      <h3 className="cookie-notice-title">Мы используем файлы cookie</h3>

      <div className="cookie-notice-container">
        <div className="cookie-notice-content">
          <p className="cookie-notice-description">
            для вашего удобства пользования сайтом<br />
            и повышения качества
          </p>

          <div className="cookie-notice-actions">
            <button
              className="cookie-notice-btn-accept"
              onClick={handleAccept}
            >
              Принять и закрыть
            </button>
            <a href="#" className="cookie-notice-link">
              Подробнее
            </a>
          </div>
        </div>

        <div className="cookie-notice-image">
          <img src="/images/cookie.png" alt="Cookie" />
        </div>
      </div>
    </div>
  );
}
