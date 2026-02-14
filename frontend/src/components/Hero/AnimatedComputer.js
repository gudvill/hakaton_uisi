import { useState, useEffect } from 'react';
import './AnimatedComputer.css';

export default function AnimatedComputer() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    // Моргание каждые 3-5 секунд
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 200); // Длительность моргания 200ms
    }, Math.random() * 2000 + 3000); // Случайный интервал 3-5 секунд

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="animated-computer">
      <img
        src="/images/computer-base.png"
        alt="Computer Base"
        className="computer-layer computer-base"
      />
      <img
        src="/images/computer-eyes-open.png"
        alt="Computer Eyes Open"
        className={`computer-layer computer-eyes ${isBlinking ? 'hidden' : ''}`}
      />
      <img
        src="/images/computer-eyes-closed.png"
        alt="Computer Eyes Closed"
        className={`computer-layer computer-eyes ${isBlinking ? '' : 'hidden'}`}
      />
    </div>
  );
}
