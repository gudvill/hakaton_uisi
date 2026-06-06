import { motion } from 'framer-motion';

const variants = {
  fadeUp:    { hidden: { opacity: 0, y: 50 },   visible: { opacity: 1, y: 0 } },
  fadeDown:  { hidden: { opacity: 0, y: -30 },  visible: { opacity: 1, y: 0 } },
  fadeLeft:  { hidden: { opacity: 0, x: -50 },  visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 50 },   visible: { opacity: 1, x: 0 } },
  fadeIn:    { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  zoomIn:    { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

export default function FadeIn({
  children,
  variant = 'fadeUp',
  duration = 0.6,
  delay = 0,
  ease = [0.25, 0.1, 0.25, 1],
  className,
  style,
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants[variant]}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
