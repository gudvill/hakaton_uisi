import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      question: "Кто может участвовать в хакатоне?",
      answer: "Хакатон открыт для всех: разработчиков, дизайнеров, продакт-менеджеров, студентов и всех, кто интересуется технологиями. Опыт не требуется!"
    },
    {
      question: "Нужно ли иметь команду заранее?",
      answer: "Нет, не обязательно. Вы можете прийти один и найти команду на месте во время питч-сессии или зарегистрироваться с готовой командой до 5 человек."
    },
    {
      question: "Какие технологии можно использовать?",
      answer: "Любые! Мы не ограничиваем участников в выборе технологий. Используйте то, что знаете лучше всего или изучайте что-то новое."
    },
    {
      question: "Предоставляется ли питание?",
      answer: "Да, питание включено в участие. Мы обеспечиваем завтраки, обеды, ужины и кофе-брейки в течение всего мероприятия."
    },
    {
      question: "Где можно остановиться на ночь?",
      answer: "Мы предоставляем спальные места в зоне отдыха, но рекомендуем взять с собой спальный мешок. Также есть список партнерских отелей со скидками."
    },
    {
      question: "Что нужно взять с собой?",
      answer: "Ноутбук, зарядные устройства, личные вещи. Все остальное (интернет, питание, рабочие места) будет предоставлено организаторами."
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <h2 className="section-title">Часто задаваемые вопросы</h2>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className={`faq-item ${openItems[index] ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openItems[index] ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;