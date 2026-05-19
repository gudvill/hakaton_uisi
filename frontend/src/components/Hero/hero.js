import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero({ onOpenRegistration }) {
  return (
    <section className="hero">
      <div className="hero-background" aria-hidden="true" />
      <div className="hero-body">
        <div className="hero-title-wrap">
          <h1 className="hero-title">ХАКАТОН</h1>
          <div className="hero-mirror" aria-hidden="true">ХАКАТОН</div>
        </div>

        <div className="hero-buttons container">
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
    </section>
  );
}
