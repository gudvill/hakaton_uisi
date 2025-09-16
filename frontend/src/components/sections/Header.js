import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <img src="\images\logo.jpg" alt="логотип"></img>
            <h2>Всероссийский хакатон связи 2025</h2>
          </Link>
        </div>
        <ul className="navbar-nav">
          <li><a href="#about">О мероприятии</a></li>
          <li><a href="#cases">Кейсы</a></li>
          <li><a href="#reviews">Отзывы</a></li>
          <li><a href="#news">Новости</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><Link to="/registration">Регистрация</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;