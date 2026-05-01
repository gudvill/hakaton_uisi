import './Faq.css';
import { useState, useEffect } from 'react';
import { getFaq, createFaq, updateFaq, deleteFaq } from '../../../../api/faqService';
import { PencilIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Faq() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [openId, setOpenId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getFaq();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setOpenId(null);
  };

  const startAdd = () => {
    setEditId('new');
    setForm({ question: '', answer: '' });
    setOpenId(null);
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  const save = async () => {
    if (!form.question?.trim() || !form.answer?.trim()) {
      alert('Заполните вопрос и ответ');
      return;
    }

    try {
      setSaving(true);

      if (editId === 'new') {
        await createFaq(form);
      } else {
        await updateFaq(editId, form);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Удалить вопрос?')) return;
    try {
      await deleteFaq(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  const EditCard = () => (
    <div className="faq-edit-card">
      {inp('question', 'Вопрос')}
      <textarea className="section-textarea" value={form.answer || ''} placeholder="Ответ" onChange={(e) => setForm(p => ({ ...p, answer: e.target.value }))} />
      <div className="section-row-actions" style={{ marginTop: 4 }}>
        <button className="section-save-btn" onClick={save} disabled={saving} >
          {saving ? 'сохранение...' : 'сохранить'}
        </button>
        <button className="section-cancel-btn" onClick={cancel}>
          отмена
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>FAQ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>
      <div className="faq-list">
        {editId === 'new' && <EditCard />}
        {items.length === 0 && editId !== 'new' && (<p className="section-empty">Нет вопросов</p>)}
        {items.map(item =>
          editId === item.id ? (
            <EditCard key={item.id} />
          ) : (
            <div key={item.id} className="faq-item">
              <div className="faq-question"
                onClick={() =>
                  setOpenId(p => (p === item.id ? null : item.id))
                } >
                <span>{item.question}</span>
                <div className="faq-question-right">
                  <button className="section-icon-btn section-icon-btn--edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(item);
                    }} >
                    <PencilIcon style={{ width: 14, height: 14 }} />
                  </button>
                  <button className="section-icon-btn section-icon-btn--delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      del(item.id);
                    }} >
                    <TrashIcon style={{ width: 14, height: 14 }} />
                  </button>
                  <ChevronDownIcon className={`faq-chevron ${
                      openId === item.id ? 'faq-chevron--open' : ''
                    }`}
                    style={{ width: 16, height: 16 }} />
                </div>
              </div>
              {openId === item.id && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}