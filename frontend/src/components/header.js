import './header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <div className="header-logo">
            <img src="images/logo.jpg" alt="логотип" />
            <span>Всероссийский хакатон связи</span>
          </div>

          <div className="header-menu">
            <a href="#company" className="header-link">Кейсы</a>
            <a href="#features" className="header-link">Новости</a>
            <a href="#resources" className="header-link">FAQ</a>
            <a href="#docs" className="header-link">Партнеры</a>
          </div>

          <button className="header-signin">
            Записаться
          </button>
        </div>
      </nav>
    </header>
  );
}
