import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero({ onOpenRegistration }) {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-container container">
      <h1 className="hero-title" data-text="HAKATON">HAKATON</h1>
        <div className="hero-grid">
          <div className="hero-content">
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
