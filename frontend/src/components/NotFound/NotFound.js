import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './NotFound.css';

const FRAMES = [
  '/images/404.svg',
  '/images/404_2.svg',
];

const FRAME_INTERVAL = 400;

export default function NotFound() {
  const navigate = useNavigate();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (FRAMES.length <= 1) return;
    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % FRAMES.length);
    }, FRAME_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header />
      <div className="notfound-page">
        <div className="notfound-content">
          <img src={FRAMES[frameIndex]} alt="404" className="notfound-code" />
          <h1 className="notfound-title">СТРАНИЦА НЕ НАЙДЕНА</h1>
          <button className="notfound-button" onClick={() => navigate('/')}>
            ВЕРНУТЬСЯ НА ГЛАВНУЮ
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
