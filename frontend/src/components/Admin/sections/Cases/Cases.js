import './Cases.css';
import { useState, useEffect } from 'react';
import { getCases } from '../../../../api/casesService';
import { getPartners } from '../../../../api/partnersService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const LEVELS = [
  { value: 'standard', label: 'Стартовый' },
  { value: 'advanced', label: 'Продвинутый' },
];

const sel = (key, options, placeholder) => ({ form, setForm }) => (
  <select
    className="section-input cases-select"
    value={form[key] || ''}
    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
  >
    <option value="">{placeholder}</option>
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

export default function Cases() {
  const [items, setItems] = useState([]);
  const [partners, setPartners] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getCases().then(setItems).catch(console.error);
    getPartners().then(setPartners).catch(console.error);
  }, []);

  const partnerOptions = partners.map(p => ({ value: p.name, label: p.name }));

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ name: '', level: '', partner_name: '', case_number: '' }); };
  const cancel    = () => { setEditId(null); setForm({}); };
  const save = () => {
    if (editId === 'new') {
      setItems(p => [...p, { ...form, id: Date.now() }]);
    } else {
      setItems(p => p.map(i => i.id === editId ? { ...i, ...form } : i));
    }
    cancel();
  };
  const del = (id) => setItems(p => p.filter(i => i.id !== id));

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  const LevelSelect = sel('level', LEVELS, 'Уровень');
  const PartnerSelect = sel('partner_name', partnerOptions, 'Партнёр');

  const levelLabel = (val) => LEVELS.find(l => l.value === val)?.label || val || '—';

  const EditRow = () => (
    <tr className="section-edit-row">
      <td style={{ width: 70 }}>{inp('case_number', '№')}</td>
      <td>{inp('name', 'Название кейса')}</td>
      <td style={{ width: 150 }}><LevelSelect form={form} setForm={setForm} /></td>
      <td><PartnerSelect form={form} setForm={setForm} /></td>
      <td>
        <div className="section-row-actions">
          <button className="section-save-btn" onClick={save}>сохранить</button>
          <button className="section-cancel-btn" onClick={cancel}>отмена</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>КЕЙСЫ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>
      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr><th>№</th><th>Название</th><th>Уровень</th><th>Партнёр</th><th></th></tr>
          </thead>
          <tbody>
            {editId === 'new' && <EditRow />}
            {items.length === 0 && editId !== 'new' && (
              <tr><td colSpan={5} className="section-empty">Нет кейсов</td></tr>
            )}
            {items.map(item => editId === item.id ? (
              <EditRow key={item.id} />
            ) : (
              <tr key={item.id}>
                <td><span className="section-badge">{item.case_number || '—'}</span></td>
                <td className="cases-name">{item.name}</td>
                <td>
                  {item.level && (
                    <span className={`cases-level-badge cases-level-badge--${item.level}`}>
                      {levelLabel(item.level)}
                    </span>
                  )}
                  {!item.level && '—'}
                </td>
                <td style={{ color: '#666' }}>{item.partner_name || '—'}</td>
                <td>
                  <div className="section-row-actions">
                    <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(item)}>
                      <PencilIcon style={{ width: 15, height: 15 }} />
                    </button>
                    <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(item.id)}>
                      <TrashIcon style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
