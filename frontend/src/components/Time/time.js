import { useEffect, useState } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { getEventDate } from '../../api/programService';
import FadeIn from '../FadeIn/FadeIn';
import './time.css';

export default function Time() {
  const [eventDate, setEventDate] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    getEventDate()
      .then((data) => {
        const date = new Date(`${data.date}T00:00:00`);
        if (!Number.isNaN(date.getTime())) {
          setEventDate(date);
        }
      })
      .catch(() => {
        console.error('Ошибка загрузки даты события');
      });
  }, []);

  if (!eventDate) {
    return null;
  }

  return (
    <section className="time">
      <div className="time-container container">
        <FadeIn variant="fadeUp" duration={0.6}>
          {!isComplete && <h2 className="time-title">до события осталось</h2>}
          <FlipClockCountdown
            to={eventDate}
            className="time-flip-clock"
            labels={['ДНЕЙ', 'ЧАСОВ', 'МИНУТ', 'СЕКУНД']}
            showSeparators
            duration={0.5}
            hideOnComplete
            stopOnHiddenVisibility
            onComplete={() => setIsComplete(true)}
            labelStyle={{ fontFamily: "'Montserrat', sans-serif" }}
            digitBlockStyle={{ fontFamily: "'Russo One', sans-serif" }}
          >
            <h2 className="time-title time-title--complete">событие началось</h2>
          </FlipClockCountdown>
        </FadeIn>
      </div>
    </section>
  );
}
