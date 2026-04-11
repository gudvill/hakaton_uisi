import { useState, useEffect } from 'react';
import { getEventDate } from '../../api/programService';
import './time.css';

export default function Time() {
  const [eventDate, setEventDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    getEventDate()
      .then(data => {
        setEventDate(new Date(data.date + "T00:00:00"));
      })
      .catch(() => {
        console.error("Ошибка загрузки даты события");
      });
  }, []);

  useEffect(() => {
    if (!eventDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) {
    return (
      <section className="time">
        <div className="time-container container">
          <h2 className="time-title">событие началось</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="time">
      <div className="time-container container">
        <h2 className="time-title">до события осталось</h2>
        <div className="time-countdown">
          <div className="time-box">
            <div className="time-number">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="time-label">дней</div>
          </div>
          <div className="time-box">
            <div className="time-number">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="time-label">часов</div>
          </div>
          <div className="time-box">
            <div className="time-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="time-label">минут</div>
          </div>
        </div>
      </div>
    </section>
  );
}