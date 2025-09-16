import React from 'react';
import Header from '../components/sections/Header';
import Footer from '../components/sections/Footer';
import '../styles/Schedule.css';

const Schedule = () => {
  const scheduleData = [
    {
      day: 'День 1 - 15 марта',
      events: [
        { time: '09:00-10:00', title: 'Регистрация и приветственный кофе', description: 'Знакомство участников, получение материалов' },
        { time: '10:00-11:00', title: 'Торжественное открытие', description: 'Приветствие организаторов и партнеров' },
        { time: '11:00-12:00', title: 'Презентация кейсов', description: 'Знакомство с задачами от компаний-партнеров' },
        { time: '12:00-13:00', title: 'Формирование команд', description: 'Питч-сессия и объединение в команды' },
        { time: '13:00-14:00', title: 'Обед', description: '' },
        { time: '14:00-18:00', title: 'Старт разработки', description: 'Работа над проектами' },
        { time: '18:00-19:00', title: 'Ужин', description: '' },
        { time: '19:00-22:00', title: 'Продолжение работы', description: 'Разработка и консультации с менторами' }
      ]
    },
    {
      day: 'День 2 - 16 марта',
      events: [
        { time: '09:00-10:00', title: 'Завтрак', description: '' },
        { time: '10:00-12:00', title: 'Интенсивная разработка', description: 'Работа над проектами' },
        { time: '12:00-13:00', title: 'Мастер-класс', description: 'Технические доклады от экспертов' },
        { time: '13:00-14:00', title: 'Обед', description: '' },
        { time: '14:00-17:00', title: 'Разработка и тестирование', description: 'Финализация решений' },
        { time: '17:00-18:00', title: 'Подготовка презентаций', description: 'Создание питчей для демо' },
        { time: '18:00-19:00', title: 'Ужин', description: '' },
        { time: '19:00-22:00', title: 'Финальная доработка', description: 'Последние штрихи проектов' }
      ]
    },
    {
      day: 'День 3 - 17 марта',
      events: [
        { time: '09:00-10:00', title: 'Завтрак', description: '' },
        { time: '10:00-12:00', title: 'Финализация проектов', description: 'Последние приготовления к демо' },
        { time: '12:00-15:00', title: 'Демо-сессия', description: 'Презентация проектов жюри' },
        { time: '15:00-16:00', title: 'Обед и обсуждение', description: 'Жюри оценивает проекты' },
        { time: '16:00-17:00', title: 'Церемония награждения', description: 'Объявление победителей и вручение призов' },
        { time: '17:00-18:00', title: 'Нетворкинг и закрытие', description: 'Общение и подведение итогов' }
      ]
    }
  ];

  return (
    <div className="schedule-page">
      <Header />
      <main className="schedule-main">
        <div className="container">
          <div className="page-header">
            <h1>Расписание мероприятия</h1>
            <p>Подробная программа Хакатона 2025</p>
          </div>

          <div className="schedule-content">
            {scheduleData.map((day, dayIndex) => (
              <div key={dayIndex} className="schedule-day">
                <h2 className="day-title">{day.day}</h2>
                <div className="events-list">
                  {day.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="event-item">
                      <div className="event-time">{event.time}</div>
                      <div className="event-details">
                        <h3 className="event-title">{event.title}</h3>
                        {event.description && (
                          <p className="event-description">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="schedule-note">
            <p>
              <strong>Примечание:</strong> Расписание может быть изменено организаторами.
              Следите за обновлениями в нашем Telegram-канале.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;