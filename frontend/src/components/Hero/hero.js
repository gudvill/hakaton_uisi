import './hero.css';
import { motion } from 'framer-motion';
import AnimatedComputer from './AnimatedComputer';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
});

export default function Hero({ onOpenRegistration }) {
  return (
    <section className="hero">
      <div className="hero-background" aria-hidden="true" />
      <div className="hero-body">
        <motion.div className="hero-title-wrap" {...fadeUp(0.1)}>
          <h1 className="hero-title">ХАКАТОН</h1>
          <div className="hero-mirror" aria-hidden="true">ХАКАТОН</div>
        </motion.div>

        <motion.div className="hero-buttons container" {...fadeUp(0.35)}>
          <a href="#hakaton" className="hero-btn hero-btn-outline">
            подробнее
          </a>
          <button type="button" className="hero-btn hero-btn-solid" onClick={onOpenRegistration}>
            участвовать
          </button>
        </motion.div>

        <motion.div className="hero-visual" {...fadeUp(0.55)}>
          <AnimatedComputer />
        </motion.div>
      </div>
    </section>
  );
}
