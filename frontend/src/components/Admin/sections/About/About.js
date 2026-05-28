import './About.css';
import { useState, useEffect } from 'react';
import { getAbout, createAbout, updateAbout, deleteAbout } from '../../../../api/aboutService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import FileInputButton from '../../FileInputButton';

function AboutEditRow({ form, setForm, file, setFile, apiUrl, onSave, onCancel }) {
  const inp = (key, placeholder) => (
    <input
      className="section-input"
      value={form[key] || ''}
      placeholder={placeholder}
      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
    />
  );
  return (
    <tr className="section-edit-row">
      <td>
        {file ? (
          <img className="section-thumbnail" src={URL.createObjectURL(file)} alt="" style={{ objectFit: 'contain', background: '#f3f0ff' }} />
        ) : form.icon ? (
          <img className="section-thumbnail" src={`${apiUrl}${form.icon}`} alt="" style={{ objectFit: 'contain', background: '#f3f0ff' }} />
        ) : (
          <div style={{ width: 44, height: 44, background: '#f3f0ff', borderRadius: 8 }} />
        )}
        <FileInputButton onChange={e => setFile(e.target.files[0])} />
      </td>
      <td>{inp('title', 'Заголовок')}</td>
      <td>
        <textarea
          className="section-textarea about-textarea"
          value={form.text || ''}
          placeholder="Описание"
          onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
        />
      </td>
      <td>
        <select
          className="section-input"
          value={form.order_index || ''}
          onChange={(e) =>
            setForm((p) => ({...p, order_index: Number(e.target.value)}))}>
          <option value="">—</option>
          {[...Array(20)].map((_, idx) => {
            const n = idx + 1;
            return (<option key={n} value={n}>{n}</option>);
          })}
        </select>
      </td>
      <td>
        <div className="section-row-actions">
          <button type="button" className="section-save-btn" onClick={onSave}>сохранить</button>
          <button type="button" className="section-cancel-btn" onClick={onCancel}>отмена</button>
        </div>
      </td>
    </tr>
  );
}

export default function About() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  const load = async () => {
    try {
      const data = await getAbout();
      setItems([...data].sort((a, b) => a.order_index - b.order_index));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item) => { setEditId(item.id); setForm({ ...item }); setFile(null); };
  const startAdd = () => { setEditId('new'); setForm({order_index: '', title: '', text: ''}); setFile(null); };
  const cancel = () => { setEditId(null); setForm({}); setFile(null); };

  const save = async () => {
    const formData = new FormData();
    Object.keys(form).forEach(k => {
      if (form[k] !== '' && form[k] !== null && form[k] !== undefined) {
        formData.append(k, form[k]);
      }
    });
    if (file) formData.append('file', file);

    try {
      if (editId === 'new') {
        await createAbout(formData);
      } else {
        await updateAbout(editId, formData);
      }
      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    try {
      await deleteAbout(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>О ХАКАТОНЕ — ROADMAP</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>

      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Иконка</th>
              <th>Заголовок</th>
              <th>Описание</th>
              <th style={{ width: 80 }}>Порядок</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {editId === 'new' && (
              <AboutEditRow form={form} setForm={setForm} file={file} setFile={setFile} apiUrl={API_URL} onSave={save} onCancel={cancel} />
            )}
            {items.length === 0 && editId !== 'new' && (
              <tr><td colSpan={5} className="section-empty">Нет шагов</td></tr>
            )}
            {items.map((item) =>
              editId === item.id ? (
                <AboutEditRow key={item.id} form={form} setForm={setForm} file={file} setFile={setFile} apiUrl={API_URL} onSave={save} onCancel={cancel} />
              ) : (
                <tr key={item.id}>
                  <td>
                    {item.icon
                      ? <img className="section-thumbnail" src={`${API_URL}${item.icon}`} alt="" />
                      : <span style={{ color: '#ccc', fontSize: 12 }}>нет</span>}
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td className="about-text-cell">{item.text}</td>
                  <td style={{ textAlign: 'center' }}>{item.order_index || '—'}</td>
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
