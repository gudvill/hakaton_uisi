import './header.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistrationModal from './registration';

export default function Header({ onOpenRegistration, isRegistrationOpen, setIsRegistrationOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <nav className="header-nav container">
          <div className="header-container">
            <Link to="/" className="header-logo">
              <img src="/images/logo2.svg" alt="HAKATON" />
            </Link>

            <div className="header-menu">
              <a href="#hakaton" className="header-link">О хакатоне</a>
              <a href="#cases" className="header-link">Кейсы</a>
              <a href="#partners" className="header-link">Партнеры</a>
              <a href="/news" className="header-link">Новости</a>
              <a href="#faq" className="header-link">FAQ</a>
              <a href="/photogallery" className='header-link'>Фотогалерея</a>
            </div>

            <button className="header-signin" onClick={onOpenRegistration}>
              Регистрация
            </button>
          </div>
        </nav>
      </header>

      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
    </>
  );
}