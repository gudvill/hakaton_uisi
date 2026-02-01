import { useState, useEffect } from 'react';
import './time.css';

export default function Time() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 12,
    minutes: 12,
    seconds: 0
  });

  useEffect(() => {
    const eventDate = new Date('2025-02-01T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="time">
      <div className="time-container container">
        <h2 className="time-title">ДО СОБЫТИЯ ОСТАЛОСЬ</h2>
        <div className="time-countdown">
          <div className="time-box">
            <div className="time-number">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="time-label">ДНЕЙ</div>
          </div>
          <div className="time-box">
            <div className="time-number">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="time-label">ЧАСОВ</div>
          </div>
          <div className="time-box">
            <div className="time-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="time-label">МИНУТ</div>
          </div>
          <div className="time-box">
            <div className="time-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="time-label">СЕКУНД</div>
          </div>
        </div>
      </div>
    </section>
  );
}
