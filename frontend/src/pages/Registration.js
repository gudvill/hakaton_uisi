import React, { useState } from 'react';
import Header from '../components/sections/Header';
import Footer from '../components/sections/Footer';
import '../styles/Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    team: '',
    portfolio: '',
    motivation: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Регистрация:', formData);
    alert('Спасибо за регистрацию! Мы отправим подтверждение на ваш email.');
  };

  return (
    <div className="registration-page">
      <Header />
      <main className="registration-main">
        <div className="container">
          <div className="registration-header">
            <h1>Регистрация на Хакатон 2025</h1>
            <p>Заполните форму для участия в мероприятии</p>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Личная информация</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Профессиональная информация</h3>
              <div className="form-group">
                <label>Уровень опыта</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите уровень</option>
                  <option value="beginner">Начинающий (0-1 год)</option>
                  <option value="junior">Junior (1-3 года)</option>
                  <option value="middle">Middle (3-5 лет)</option>
                  <option value="senior">Senior (5+ лет)</option>
                  <option value="student">Студент</option>
                </select>
              </div>
              <div className="form-group">
                <label>Технические навыки</label>
                <textarea
                  name="skills"
                  placeholder="Перечислите языки программирования, фреймворки, инструменты..."
                  value={formData.skills}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Команда (необязательно)</label>
                <input
                  type="text"
                  name="team"
                  placeholder="Название команды или оставьте пустым"
                  value={formData.team}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Дополнительная информация</h3>
              <div className="form-group">
                <label>Портфолио / GitHub</label>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://github.com/username"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Мотивация</label>
                <textarea
                  name="motivation"
                  placeholder="Почему вы хотите участвовать в хакатоне?"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;