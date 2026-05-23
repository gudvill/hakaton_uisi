import './Cookie.css';
import { useState } from 'react';

export default function Cookie() {
  const [text, setText] = useState(
    'Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей политикой конфиденциальности.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>COOKIE — УВЕДОМЛЕНИЕ</h3>
      </div>

      <p className="cookie-hint">
        Текст, который отображается в баннере cookie при первом посещении сайта.
      </p>

      <textarea
        className="section-textarea cookie-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
      />

      <div className="section-row-actions" style={{ marginTop: 12 }}>
        <button
          type="button"
          className="section-save-btn"
          onClick={handleSave}
        >
          {saved ? 'сохранено ✓' : 'сохранить'}
        </button>
      </div>
    </div>
  );
}
