import './registration.css';
import { useState, useEffect } from 'react';
import { registerTeam } from "../../api/registrationService";
import CustomAlert from '../CustomAlert/CustomAlert';
import FormSelect from '../FormSelect/FormSelect';
import { Checkbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'

const LEVEL_OPTIONS = [
  { value: 'спо 9класс',              label: 'Среднее профессиональное на базе 9 класса' },
  { value: 'спо 11класс',             label: 'Среднее профессиональное на базе 11 класса' },
  { value: 'бакалавриат/специалитет', label: 'Бакалавриат/Специалитет' },
  { value: 'магистратура',            label: 'Магистратура' },
];

const ROLE_OPTIONS = [
  { value: 'участник', label: 'Участник' },
  { value: 'капитан',  label: 'Капитан' },
];

const COURSE_OPTIONS = [
  { value: '1', label: '1 курс' },
  { value: '2', label: '2 курс' },
  { value: '3', label: '3 курс' },
  { value: '4', label: '4 курс' },
  { value: '5', label: '5 курс' },
];

export default function Registration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    amount_participants: '',
    participation_form: '',
    level_education: '',
    selected_case: '',
    spare_case: '',
    captain_phone: '',
    captain_email: '',
    curator_data: '',
    agreement: false,
    acquaintance: false,
    participants: []
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [alertAfterClose, setAlertAfterClose] = useState(null);

  const showAlert = (msg, type = 'info', afterClose = null) => {
    setAlertMessage(msg);
    setAlertType(type);
    setAlertAfterClose(() => afterClose);
  };

  const closeAlert = () => {
    setAlertMessage('');
    setAlertType('info');
    if (alertAfterClose) alertAfterClose();
    setAlertAfterClose(null);
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name === 'amount_participants') {
      const count = Math.max(2, Math.min(5, parseInt(value) || 2));
      const newParticipants = Array.from({ length: count }, (_, i) => ({
        id: i,
        fio: '',
        role: '',
        course: ''
      }));
      setFormData(prev => ({
        ...prev,
        amount_participants: count,
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

  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch("/api/cases/")
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(() => setCases([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = [];

    if (!formData.name.trim()) missing.push('Название команды');
    if (!formData.institution.trim()) missing.push('Учебное заведение');
    if (!formData.amount_participants) missing.push('Количество участников');
    if (!formData.participation_form) missing.push('Форма участия');
    if (!formData.level_education) missing.push('Ступень образования');
    if (!formData.selected_case) missing.push('Основной кейс');
    if (!formData.captain_phone.trim()) missing.push('Телефон капитана');
    if (!formData.captain_email.trim()) missing.push('E-mail капитана');
    if (!formData.curator_data.trim()) missing.push('ФИО и телефон куратора');

    formData.participants.forEach((p, i) => {
      if (!p.fio.trim()) missing.push(`ФИО участника ${i + 1}`);
      if (!p.role) missing.push(`Роль участника ${i + 1}`);
      if (!p.course) missing.push(`Курс участника ${i + 1}`);
    });

    if (!formData.agreement) missing.push('Согласие на обработку персональных данных');
    if (!formData.acquaintance) missing.push('Ознакомление с политикой конфиденциальности');

    if (missing.length > 0) {
      showAlert('Пожалуйста, заполните следующие поля:\n' + missing.map(m => `• ${m}`).join('\n'));
      return;
    }

    const { participants, ...teamData } = formData;

    const captainCount = participants.filter(p => p.role === 'капитан').length;
    if (captainCount === 0) {
      showAlert('В команде должен быть капитан');
      return;
    }
    if (captainCount > 1) {
      showAlert('Капитан должен быть только один');
      return;
    }

    if (teamData.selected_case && teamData.spare_case && teamData.selected_case === teamData.spare_case) {
      showAlert('Основной и запасной кейс не могут совпадать');
      return;
    }

    const selectedCase = cases.find(c => c.id === Number(teamData.selected_case));
    if (selectedCase) {
      const courseNumbers = participants.map(p => Number(p.course));
      const caseLevel = selectedCase.level?.toLowerCase();
      const level = teamData.level_education?.toLowerCase();

      if (caseLevel === 'стартовый') {
        if (courseNumbers.some(c => c > 2) || level === 'магистратура') {
          showAlert('Этот кейс только для 1–2 курса');
          return;
        }
      }

      if (caseLevel === 'продвинутый') {
        if (courseNumbers.some(c => c < 3) && level !== 'магистратура') {
          showAlert('Этот кейс только для 3+ курса и магистрантов');
          return;
        }
      }
    }

    const payload = {
      team: {
        ...teamData,
        curator_data: { text: teamData.curator_data }
      },
      participants: participants.map(p => ({
        fio: p.fio,
        role: p.role,
        course: Number(p.course)
      }))
    };

    try {
      await registerTeam(payload);
      showAlert('Вы успешно зарегистрированы!', 'success', onClose);
    } catch (err) {
      showAlert(err.response?.data?.detail || 'Ошибка при регистрации', 'error');
    }
  };

  return (
    <>
      <CustomAlert message={alertMessage} onClose={closeAlert} type={alertType} />

      {isOpen && <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}><img src='/images/close.svg' alt="закрыть" /></button>
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
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Учебное заведение"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
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
              />
            </label>
            <FormSelect
              value={formData.level_education}
              onChange={(val) => setFormData(prev => ({ ...prev, level_education: val }))}
              options={LEVEL_OPTIONS}
              placeholder="Ступень образования"
            />

            <p className='form-subtitle'>Форма участия</p>
            <label className="radio-group">
              <input
                type="radio"
                name="participation_form"
                value="Очная"
                checked={formData.participation_form === 'Очная'}
                onChange={handleInputChange}
              />
              <span>Очная</span>
              <input
                type="radio"
                name="participation_form"
                value="Дистанционная"
                checked={formData.participation_form === 'Дистанционная'}
                onChange={handleInputChange}
              />
              <span>Дистанционная</span>
            </label>

            <p className='form-subtitle'>Состав команды ({formData.amount_participants || 0})</p>
            <div className='members'>
              {formData.participants.map((participant, index) => (
                <div key={participant.id} className="participant-row">
                  <label>
                    <input
                      type="text"
                      placeholder={`ФИО участника ${index + 1}`}
                      value={participant.fio}
                      onChange={(e) => handleParticipantChange(index, 'fio', e.target.value)}
                    />
                  </label>
                  <div style={{ flex: 1 }}>
                    <FormSelect
                      value={participant.role}
                      onChange={(val) => handleParticipantChange(index, 'role', val)}
                      options={ROLE_OPTIONS}
                      placeholder="Роль"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <FormSelect
                      value={participant.course}
                      onChange={(val) => handleParticipantChange(index, 'course', val)}
                      options={COURSE_OPTIONS}
                      placeholder="Курс"
                    />
                  </div>
                </div>
              ))}
            </div>

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

            <label className="checkbox-group">
              <Checkbox
                checked={formData.agreement}
                onChange={(val) => setFormData(prev => ({ ...prev, agreement: val }))}
                className="group shrink-0 size-6 rounded-md bg-white p-1 ring-1 ring-[#2055C7] ring-inset data-[checked]:bg-[#2055C7]"
              >
                <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block" />
              </Checkbox>
              <span><a href='#'>Согласие на обработку персональных данных</a></span>
            </label>

            <label className="checkbox-group">
              <Checkbox
                checked={formData.acquaintance}
                onChange={(val) => setFormData(prev => ({ ...prev, acquaintance: val }))}
                className="group shrink-0 size-6 rounded-md bg-white p-1 ring-1 ring-[#2055C7] ring-inset data-[checked]:bg-[#2055C7]"
              >
                <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block" />
              </Checkbox>
              <span><a href='#'>Политика конфиденциальности</a></span>
            </label>

            <button className="registration-button" type="submit">
              ЗАРЕГИСТРИРОВАТЬСЯ
            </button>
          </form>
        </div>
      </div>}
    </>
  );
}
