import './header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav container">
        <div className="header-container">
          <div className="header-logo">
            <img src="images/logo2.svg" alt="HAKATON" />
          </div>

          <div className="header-menu">
            <a href="#hakaton" className="header-link">О хакатоне</a>
            <a href="#cases" className="header-link">Кейсы</a>
            <a href="#partners" className="header-link">Партнеры</a>
            <a href="#news" className="header-link">Новости</a>
            <a href="#faq" className="header-link">FAQ</a>
          </div>

          <button className="header-signin" type="button">
            Регистрация
          </button>
        </div>
      </nav>
    </header>
  );
}
