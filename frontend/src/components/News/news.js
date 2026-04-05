import { Link } from 'react-router-dom';
import './news.css';

const MOCK_NEWS = [
  {
    id: 1,
    date: '26 ноября',
    title: 'Интервью с командой Кот будущего',
    preview: 'Команда кот будущего на Всероссийском хакатоне — яркий пример того, как студенты решают реальные задачи отрасли.',
    image: 'images/news1.jpg',
  },
  {
    id: 2,
    date: '18 ноября',
    title: 'Подведение итогов хакатона 2025',
    preview: 'Объявлены победители Всероссийского хакатона связи. Узнайте, какие команды получили призы и признание экспертов.',
    image: 'images/news2.jpg',
  },
  {
    id: 3,
    date: '14 ноября',
    title: 'Открытие хакатона связи 2025',
    preview: 'Более 200 участников со всей страны собрались на торжественном открытии хакатона. Старт дан!',
    image: 'images/news3.jpg',
  },
  {
    id: 4,
    date: '6 ноября',
    title: 'Завершён приём заявок',
    preview: 'Приём заявок на участие в хакатоне завершён. Зарегистрировано рекордное количество команд — более 60.',
    image: 'images/news4.jpg',
  },
];

export default function News() {
  const news = MOCK_NEWS;;

  return (
    <section className="news container" id="news">
      <div className="news-header">
        <h2>НОВОСТИ</h2>
      </div>

      <div className="news-grid">
        {news.slice(0, 4).map((item) => (
          <div key={item.id} className="news-card-wrapper">
            <Link className="news-card" to={`/news/${item.id}`}>
              <div className="news-card__img-wrap">
                <img className="news-card__img" src={item.image} alt={item.title} />
              </div>
              <div className="news-card__body">
                <p className="news-card__date">{item.date}</p>
                <p className="news-card__title">{item.title}</p>
                <p className="news-card__text">{item.preview}</p>
                <span className="news-card__link">перейти →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Link className="news-all-link" to="/news">
        все новости <img src="images/arrow_white.svg" alt="стрелка" />
      </Link>
    </section>
  );
}
