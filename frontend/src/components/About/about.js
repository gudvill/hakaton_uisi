import './about.css';

// row: 1-3, col: 1-3
const steps = [
  { row: 1, col: 1, title: 'Регистрация',           text: 'Зарегистрируй команду на платформе и заполни все необходимые данные для участия.',          icon: <img src='images/registr.svg' alt='' /> },
  { row: 1, col: 2, title: 'Старт хакатона',         text: 'Официальное открытие, брифинг по кейсам и знакомство с командами и менторами.',             icon: <img src='images/rocket.svg' alt='' /> },
  { row: 1, col: 3, title: 'Формирование команд',    text: 'Окончательный состав команд, распределение ролей и выбор кейса для работы.',               icon: <img src='images/people.svg' alt='' /> },
  { row: 2, col: 1, title: 'Начало разработки',      text: 'Команды приступают к работе над кейсами, консультируются с менторами.',                     icon: <img src='images/code.svg' alt='' /> },
  { row: 2, col: 2, title: 'Подготовка презентации', text: 'Оформление результатов, подготовка презентации и финальной защиты проекта.',                icon: <img src='images/presentation.svg' alt='' /> },
  { row: 2, col: 3, title: 'Защита проекта',         text: 'Презентация решения перед жюри. Каждая команда представляет свой проект.',                  icon: <img src='images/protect.svg' alt='' /> },
  { row: 3, col: 1, title: 'Подведение итогов',      text: 'Объявление победителей, награждение и обратная связь от экспертов.',                        icon: <img src='images/medal.svg' alt='' /> },
  { row: 3, col: 2, title: 'Нетворкинг',             text: 'Общение с партнёрами, экспертами и участниками, знакомство с возможностями.',               icon: <img src='images/networking.svg' alt='' /> },
];

export default function About() {
  return (
    <section className="about container">
      <h2>О ХАКАТОНЕ</h2>

      <div className="roadmap">

        {/* Градиентная линия-змейка
            Ряды по 300px → центры строк: y=150, 450, 750
            Колонки 1/3 → центры: x=200, 600, 1000 (viewBox 0 0 1200 900)
            Дуги: r=150 ((450-150)/2=150)                               */}
        <svg
          className="roadmap-svg"
          viewBox="0 0 1200 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#A558F8" />
              <stop offset="100%" stopColor="#2055C7" />
            </linearGradient>
          </defs>
          <path
            d="M 200,150 H 1050 A 50,50 0 0,1 1100,200 V 400 A 50,50 0 0,1 1050,450 H 150 A 50,50 0 0,0 100,500 V 700 A 50,50 0 0,0 150,750 H 600"
            stroke="url(#snakeGrad)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div className="roadmap-grid">
          {steps.map((s, i) => (
            <div
              key={i}
              className="roadmap-cell"
              style={{ gridRow: s.row, gridColumn: s.col }}
            >
              <div className="roadmap-circle">{s.icon}</div>
              <div className="roadmap-label">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
