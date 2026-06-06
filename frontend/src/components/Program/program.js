import './program.css';
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { getProgram } from "../../api/programService";
import FadeIn from '../FadeIn/FadeIn';

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Program() {
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const data = await getProgram();
        setProgramData(data);
      } catch (err) {
        setError("Ошибка загрузки программы");
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, []);

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    const monthNames = [
      'января','февраля','марта','апреля','мая','июня',
      'июля','августа','сентября','октября','ноября','декабря'
    ];
    const startDay = startDate.getDate();
    const startMonth = monthNames[startDate.getMonth()];
    if (!endDate) return `${startDay} ${startMonth}`;
    const endDay = endDate.getDate();
    const endMonth = monthNames[endDate.getMonth()];
    if (startMonth === endMonth) return `${startDay}–${endDay} ${startMonth}`;
    return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
  };

  if (loading) return <div className='container'>Загрузка...</div>;
  if (error) return <div className='container'>{error}</div>;

  return (
    <section className='program container'>
      <FadeIn variant="fadeUp">
        <h2>ПРОГРАММА ХАКАТОНА</h2>
      </FadeIn>
      <motion.div
        variants={listContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {programData.map((item) => (
          <motion.div className='program-card' key={item.id} variants={rowVariant}>
            <p className='date'>{formatDateRange(item.start_date, item.end_date)}</p>
            <p className='program-text'>{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
