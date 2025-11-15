import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Кодируй.<br />
              Создавай.<br />
              Взламывай границы возможного.
            </h1>
            <p className="hero-description">
              Присоединяйтесь к хакатону и покажите свои навыки в создании
              инновационных решений. Участвуйте в захватывающих соревнованиях.
            </p>
            <div className="hero-buttons">
              <button className="hero-btn hero-btn-outline">
                Подробнее
              </button>
              <button className="hero-btn hero-btn-solid">
                Зарегистрироваться
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <AnimatedComputer />
          </div>
        </div>
      </div>
    </section>
  );
}
