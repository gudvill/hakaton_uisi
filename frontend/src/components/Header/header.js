import './header.css';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RegistrationModal from './registration';

const NAV_LINKS = [
  { href: '/#hakaton', label: 'О хакатоне' },
  { href: '/#cases', label: 'Кейсы' },
  { href: '/#partners', label: 'Партнеры' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/news', label: 'Новости' },
  { href: '/photogallery', label: 'Фотогалерея' },
];

export default function Header({ onOpenRegistration, isRegistrationOpen: externalOpen, setIsRegistrationOpen: externalSetOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localOpen, setLocalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegistrationOpen = onOpenRegistration ? externalOpen : localOpen;
  const setIsRegistrationOpen = onOpenRegistration ? externalSetOpen : setLocalOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleNavLink = (e, link) => {
    if (!link.href.startsWith('/#')) { closeMenu(); return; }
    e.preventDefault();
    closeMenu();
    const hash = link.href.slice(1);
    if (location.pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleRegistration = () => {
    closeMenu();
    if (onOpenRegistration) {
      onOpenRegistration();
    } else {
      setLocalOpen(true);
    }
  };

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}${menuOpen ? ' header--menu-open' : ''}`}>
        <nav className="header-nav container" aria-label="Основная навигация">
          <div className="header-container">
            <Link to="/" className="header-logo" onClick={closeMenu}>
              <img src="/images/logo2.svg" alt="HAKATON" />
            </Link>

            <div
              id="header-menu"
              className={`header-menu${menuOpen ? ' header-menu--open' : ''}`}
            >
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="header-link" onClick={(e) => handleNavLink(e, link)}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="header-actions">
              <button type="button" className="header-signin" onClick={handleRegistration}>
                Регистрация
              </button>

              <button
                type="button"
                className={`header-burger${menuOpen ? ' header-burger--open' : ''}`}
                aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={menuOpen}
                aria-controls="header-menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </nav>

        <button
          type="button"
          className={`header-overlay${menuOpen ? ' header-overlay--visible' : ''}`}
          aria-label="Закрыть меню"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        />
      </header>

      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
    </>
  );
}
