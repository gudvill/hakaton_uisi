import './CustomAlert.css';

const CONFIG = {
  info: {
    icon: '!',
    title: null,
    boxClass: '',
    iconClass: '',
    btnClass: '',
    centerText: false,
  },
  error: {
    icon: '✕',
    title: 'Ошибка регистрации',
    boxClass: 'custom-alert-box--error',
    iconClass: 'custom-alert-icon--error',
    btnClass: 'custom-alert-btn--error',
    centerText: true,
  },
  success: {
    icon: '✓',
    title: 'Успешно!',
    boxClass: 'custom-alert-box--success',
    iconClass: 'custom-alert-icon--success',
    btnClass: 'custom-alert-btn--success',
    centerText: true,
  },
};

export default function CustomAlert({ message, onClose, type = 'info' }) {
  if (!message) return null;

  const cfg = CONFIG[type] || CONFIG.info;

  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div className={`custom-alert-box ${cfg.boxClass}`} onClick={(e) => e.stopPropagation()}>
        <div className={`custom-alert-icon ${cfg.iconClass}`}>{cfg.icon}</div>
        {cfg.title && <p className={`custom-alert-title custom-alert-title--${type}`}>{cfg.title}</p>}
        <p className={`custom-alert-message ${cfg.centerText ? 'custom-alert-message--center' : ''}`}>
          {message}
        </p>
        <button className={`custom-alert-btn ${cfg.btnClass}`} onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
}
