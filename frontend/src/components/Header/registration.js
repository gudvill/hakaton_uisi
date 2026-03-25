import './registration.css';
import { useState } from 'react';

export default function Registration({ isOpen, onClose }) {

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    amount_participants: '',
    participant_form: '',
    level_education: '',
    selected_case: '',
    spare_case: '',
    captain_phone: '',
    captain_email: '',
    curator_data: '',
    agreement: false,
    privacy_policy: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Регистрация:', formData);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className='registration-title'>Регистрация</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <label>
            <input
              type="text"
              placeholder="Название команды"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <input
              type="text"
              placeholder="Учебное заведение"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <input
              type="number"
              placeholder="Кол-во участников"
              name="amount_participants"
              value={formData.amount_participants}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <select
              name="level_education"
              value={formData.level_education}
              onChange={handleChange}
            >
              <option value="">Ступень образования</option>
              <option value="спо 9класс">Среднее профессиональное на базе 9 класса</option>
              <option value="спо 11класс">Среднее профессиональное на базе 11 класса</option>
              <option value="бкалавриат/специалитет">Бакалавриат/Специалитет</option>
              <option value="магистратура">Магистратура</option>
            </select>
          </label>

          <label>
            Форма участия
            <input
              type="radio"
              name="participant_form"
              value="Очная"
              checked={formData.participant_form === 'Очная'}
              onChange={handleChange}
            /> Очная
            <input
              type="radio"
              name="participant_form"
              value="Дистанционная"
              checked={formData.participant_form === 'Дистанционная'}
              onChange={handleChange}
            /> Дистанционная
          </label>

          <label>
            <input type='text' placeholder='ФИО участника'></input>
          </label>
          <label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">роль в команде</option>
              <option value="участник">участник</option>
              <option value="капитан">капитан</option>
            </select>
          </label>

          <label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">курс</option>
              <option value="1">1 курс</option>
              <option value="2">2 курс</option>
              <option value="3">3 курс</option>
              <option value="4">4 курс</option>
              <option value="5">5 курс</option>
            </select>
          </label>

          <label>
            Выбранный кейс
            <input
              type="radio"
              name="selected_case"
              value="1"
              checked={formData.selected_case === '1'}
              onChange={handleChange}
            /> Кейс 1
            <input
              type="radio"
              name="selected_case"
              value="2"
              checked={formData.selected_case === '2'}
              onChange={handleChange}
            /> Кейс 2
            <input
              type="radio"
              name="selected_case"
              value="3"
              checked={formData.selected_case === '3'}
              onChange={handleChange}
            /> Кейс 3
            <input
              type="radio"
              name="selected_case"
              value="4"
              checked={formData.selected_case === '4'}
              onChange={handleChange}
            /> Кейс 4
            <input
              type="radio"
              name="selected_case"
              value="5"
              checked={formData.selected_case === '5'}
              onChange={handleChange}
            /> Кейс 5
            <input
              type="radio"
              name="selected_case"
              value="6"
              checked={formData.selected_case === '6'}
              onChange={handleChange}
            /> Кейс 6
          </label>

          <label>
            Запасной кейс
            <input
              type="radio"
              name="spare_case"
              value="1"
              checked={formData.spare_case === '1'}
              onChange={handleChange}
            /> Кейс 1
            <input
              type="radio"
              name="spare_case"
              value="2"
              checked={formData.spare_case === '2'}
              onChange={handleChange}
            /> Кейс 2
            <input
              type="radio"
              name="spare_case"
              value="3"
              checked={formData.spare_case === '3'}
              onChange={handleChange}
            /> Кейс 3
            <input
              type="radio"
              name="spare_case"
              value="4"
              checked={formData.spare_case === '4'}
              onChange={handleChange}
            /> Кейс 4
            <input
              type="radio"
              name="spare_case"
              value="5"
              checked={formData.spare_case === '5'}
              onChange={handleChange}
            /> Кейс 5
            <input
              type="radio"
              name="spare_case"
              value="6"
              checked={formData.spare_case === '6'}
              onChange={handleChange}
            /> Кейс 6
          </label>

          <label>
            <input
              type="text"
              placeholder="Телефон капитана"
              name="captain_phone"
              value={formData.captain_phone}
              onChange={handleChange}
            />
          </label>

          <label>
            <input
              type="email"
              placeholder="E-mail капитана"
              name="captain_email"
              value={formData.captain_email}
              onChange={handleChange}
            />
          </label>

          <label>
            <input
              type="text"
              placeholder="ФИО куратора, телефон"
              name="curator_data"
              value={formData.curator_data}
              onChange={handleChange}
            />
          </label>

          <label>
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
            /> Согласие
          </label>

          <label>
            <input
              type="checkbox"
              name="privacy_policy"
              checked={formData.privacy_policy}
              onChange={handleChange}
            /> Политика конфиденциальности
          </label>

          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
}