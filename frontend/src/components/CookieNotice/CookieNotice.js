import { useState, useEffect } from 'react';
import { getAcquaintanceByIdPublic } from '../../api/acquaintanceService';
import './CookieNotice.css';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      getAcquaintanceByIdPublic(3)
        .then(d => {
          setData(d);
          setIsVisible(true);
        })
        .catch(() => setIsVisible(true));
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-notice">
      <button className="cookie-notice-close" onClick={handleClose} aria-label="Закрыть">✕</button>

      <h3 className="cookie-notice-title">
        {data?.title || 'Мы используем файлы cookie'}
      </h3>

      <div className="cookie-notice-image">
        <img src="/images/cookie.png" alt="Cookie" />
      </div>

      <div className="cookie-notice-content">
        {data?.text ? (
          <div
            className="cookie-notice-description"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        ) : (
          <p className="cookie-notice-description">
            для вашего удобства пользования сайтом и повышения качества
          </p>
        )}

        <div className="cookie-notice-actions">
          <button className="cookie-notice-btn-accept" onClick={handleAccept}>
            Принять и закрыть
          </button>
          <a href="/privacy-policy" className="cookie-notice-link">
            Подробнее
          </a>
        </div>
      </div>
    </div>
  );
}
