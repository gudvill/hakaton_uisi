import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero({ onOpenRegistration }) {
  return (
    <section className="hero">
      <div className="hero-background" aria-hidden="true" />
      <div className="hero-container container">
        <h1 className="hero-title" data-text="ХАКАТОН">ХАКАТОН</h1>
        <div className="hero-grid">
          <div className="hero-buttons">
            <a href="#hakaton" className="hero-btn hero-btn-outline">
              подробнее
            </a>
            <button type="button" className="hero-btn hero-btn-solid" onClick={onOpenRegistration}>
              участвовать
            </button>
          </div>
          <div className="hero-visual">
            <AnimatedComputer />
          </div>
        </div>
      </div>
    </section>
  );
}
