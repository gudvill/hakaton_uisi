import React from 'react';
import './News.css';

const News = () => {
  const news = [
    {
      id: 1,
      title: "Открыта регистрация на Хакатон 2025",
      date: "10 февраля 2025",
      preview: "Стартовала регистрация участников на крупнейший хакатон года. Не упустите шанс стать частью технологической революции!",
      image: "/images/news1.jpg"
    },
    {
      id: 2,
      title: "Объявлены партнеры мероприятия",
      date: "5 февраля 2025",
      preview: "К нам присоединились ведущие IT-компании: Яндекс, Сбер, МТС и другие. Они предоставят менторскую поддержку и призы.",
      image: "/images/news2.jpg"
    },
    {
      id: 3,
      title: "Новые номинации и призы",
      date: "1 февраля 2025",
      preview: "Добавлены специальные номинации: 'Лучшее AI-решение', 'Экологические инновации' и 'Социальное воздействие'.",
      image: "/images/news3.jpg"
    }
  ];

  return (
    <section className="news" id="news">
      <div className="container">
        <h2 className="section-title">Новости</h2>
        <div className="news-grid">
          {news.map((article) => (
            <article key={article.id} className="news-card">
              <div className="news-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="news-content">
                <div className="news-date">{article.date}</div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-preview">{article.preview}</p>
                <button className="news-link">Читать далее</button>
              </div>
            </article>
          ))}
        </div>
        <div className="news-actions">
          <button className="btn btn-secondary">Все новости</button>
        </div>
      </div>
    </section>
  );
};

export default News;