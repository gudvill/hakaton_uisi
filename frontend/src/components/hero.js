import './hero.css';
import AnimatedComputer from './AnimatedComputer';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              КОДИРУЙ<br />
              СОЗДАВАЙ<br />
              ВЗЛАМЫВАЙ ГРАНИЦЫ ВОЗМОЖНОГО
            </h1>
            <div className="hero-buttons">
              <button className="hero-btn hero-btn-outline">
                подробнее
              </button>
              <button className="hero-btn hero-btn-solid">
                учавствовать
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
