import './registration.css';
import { useState, useEffect } from 'react';

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
    participants: []
  });

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    
    if (name === 'amount_participants') {
      const count = Math.max(2, Math.min(5, parseInt(value) || 2));
      
      // Обновляем количество участников
      const newParticipants = Array.from({ length: count }, (_, i) => ({
        id: i,
        name: '',
        role: '',
        course: ''
      }));
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        participants: newParticipants
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParticipantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
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
        <button className="modal-close" onClick={onClose}><img src='images/close.svg'></img></button>
        <h2 className='registration-title'>Регистрация</h2>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <p className='form-subtitle'>Информация о команде</p>
          <label>
            <input
              type="text"
              placeholder="Название команды"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Учебное заведение"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <input
              type="number"
              placeholder="Кол-во участников"
              name="amount_participants"
              value={formData.amount_participants}
              onChange={handleInputChange}
              min="2"
              max="5"
              required
            />
          </label>
          <label>
            <select
              name="level_education"
              value={formData.level_education}
              onChange={handleInputChange}
            >
              <option value="">Ступень образования</option>
              <option value="спо 9класс">Среднее профессиональное на базе 9 класса</option>
              <option value="спо 11класс">Среднее профессиональное на базе 11 класса</option>
              <option value="бакалавриат/специалитет">Бакалавриат/Специалитет</option>
              <option value="магистратура">Магистратура</option>
            </select>
          </label>

          {/* Форма участия */}
          <p className='form-subtitle'>Форма участия</p>
          <label className="radio-group">
            <input
              type="radio"
              name="participant_form"
              value="Очная"
              checked={formData.participant_form === 'Очная'}
              onChange={handleInputChange}
            /> 
            <span>Очная</span>
            <input
              type="radio"
              name="participant_form"
              value="Дистанционная"
              checked={formData.participant_form === 'Дистанционная'}
              onChange={handleInputChange}
            /> 
            <span>Дистанционная</span>
          </label>

          {/* Состав команды */}
          <p className='form-subtitle'>Состав команды ({formData.amount_participants || 0})</p>
          <div className='members'>
            {formData.participants.map((participant, index) => (
              <div key={participant.id} className="participant-row">
                <label>
                  <input 
                    type="text" 
                    placeholder={`ФИО участника ${index + 1}`}
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                  />
                </label>
                <label>
                  <select
                    value={participant.role}
                    onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                  >
                    <option value="">Роль</option>
                    <option value="участник">Участник</option>
                    <option value="капитан">Капитан</option>
                  </select>
                </label>
                <label>
                  <select
                    value={participant.course}
                    onChange={(e) => handleParticipantChange(index, 'course', e.target.value)}
                  >
                    <option value="">Курс</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
              </div>
            ))}
          </div>

          {/* Кейсы */}
          <p className='form-subtitle'>Выбранный кейс</p>
          <label className='case-radio-group'>
            {[1,2,3,4,5,6].map(num => (
              <label key={num} className="radio-item">
                <input
                  type="radio"
                  name="selected_case"
                  value={num.toString()}
                  checked={formData.selected_case === num.toString()}
                  onChange={handleInputChange}
                />
                <span>Кейс {num}</span>
              </label>
            ))}
          </label>

          <p className='form-subtitle'>Запасной кейс</p>
          <label className='case-radio-group'>
            {[1,2,3,4,5,6].map(num => (
              <label key={`spare-${num}`} className="radio-item">
                <input
                  type="radio"
                  name="spare_case"
                  value={num.toString()}
                  checked={formData.spare_case === num.toString()}
                  onChange={handleInputChange}
                />
                <span>Кейс {num}</span>
              </label>
            ))}
          </label>

          {/* Контакты */}
          <p className='form-subtitle'>Контакты</p>
          <label>
            <input
              type="tel"
              placeholder="Телефон капитана"
              name="captain_phone"
              value={formData.captain_phone}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <input
              type="email"
              placeholder="E-mail капитана"
              name="captain_email"
              value={formData.captain_email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="ФИО куратора, телефон"
              name="curator_data"
              value={formData.curator_data}
              onChange={handleInputChange}
            />
          </label>

          {/* Согласия */}
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleInputChange}
            />
            <span><a href='#'>Согласие на обработку персональных данных</a></span>
          </label>
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="privacy_policy"
              checked={formData.privacy_policy}
              onChange={handleInputChange}
            />
            <span><a href='#'>Политика конфиденциальности</a></span>
          </label>

          <button className="registration-button" type="submit">
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>
        </form>
      </div>
    </div>
  );
}