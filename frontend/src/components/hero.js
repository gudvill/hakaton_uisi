import './hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Кодируй
              <br />
              Создавай
              <br />
              Взламывай границы возможного
            </h1>
            <p className="hero-description">
              the best way to reach uumans insted of spam folders,
              <br />
              dlever transactional and marketing emails at scale.
            </p>

            <div className="hero-buttons">
              <a href="#docs" className="hero-btn hero-btn-outline">
                Подробнее
              </a>
              <a href="#get-started" className="hero-btn hero-btn-solid">
                Зарегистрироваться
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <p>здесь будет 3д модель</p>
          </div>
        </div>
      </div>
    </section>
  );
}
