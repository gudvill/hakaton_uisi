import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero({ onOpenRegistration }) {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-container container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              КОДИРУЙ<br />
              СОЗДАВАЙ<br />
              ВЗЛАМЫВАЙ ГРАНИЦЫ ВОЗМОЖНОГО
            </h1>
            <div className="hero-buttons">
              <a href="#hakaton" className="hero-btn hero-btn-outline">
                подробнее
              </a>
              <button className="hero-btn hero-btn-solid" onClick={onOpenRegistration}>
                участвовать
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
