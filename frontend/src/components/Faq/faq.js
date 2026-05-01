import { useState, useEffect } from 'react';
import './faq.css';
import { getFaq } from '../../api/faqService';

export default function Faq() {
  const [items, setItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const load = async () => {
    try {
      const data = await getFaq();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="faq container">
      <h2>FAQ</h2>
      <div className="faq-list">
        {items.length === 0 && (
          <p style={{ opacity: 0.6 }}>Нет данных</p>
        )}
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.id || i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`} >
              <button className="faq-header" onClick={() => toggle(i)} >
                <span className="faq-question">
                  {item.question}
                </span>
                <span className={`faq-btn${isOpen ? ' faq-btn--open' : ''}`}>+</span>
              </button>
              <div className={`faq-answer${isOpen ? ' faq-answer--open' : ''}`}>
                <div className="faq-answer-inner">
                  {(item.answer || '').split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}