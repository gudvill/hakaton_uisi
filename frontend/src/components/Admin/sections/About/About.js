import './About.css';
import { useState, useEffect } from 'react';
import { getAbout, createAbout, updateAbout, deleteAbout } from '../../../../api/aboutService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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
        <input type="file" style={{ marginTop: 4, fontSize: 11 }} onChange={(e) => setFile(e.target.files[0])} />
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
          value={form._pos || ''}
          onChange={(e) => {
            const pos = Number(e.target.value);
            setForm((p) => ({ ...p, _pos: pos, row: Math.ceil(pos / 3), col: ((pos - 1) % 3) + 1 }));
          }}
        >
          <option value="">—</option>
          {[1,2,3,4,5,6,7,8].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
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
      setItems([...data].sort((a, b) => ((a.row - 1) * 3 + a.col) - ((b.row - 1) * 3 + b.col)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item) => {
    const pos = (item.row && item.col) ? (item.row - 1) * 3 + item.col : '';
    setEditId(item.id);
    setForm({ ...item, _pos: pos });
    setFile(null);
  };
  const startAdd  = () => { setEditId('new'); setForm({ row: '', title: '', text: '' }); setFile(null); };
  const cancel    = () => { setEditId(null); setForm({}); setFile(null); };

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

        const newPos = form._pos ? Number(form._pos) : null;

        if (newPos) {
          const others = items
            .filter(i => i.id !== editId)
            .sort((a, b) => ((a.row - 1) * 3 + a.col) - ((b.row - 1) * 3 + b.col));

          const reordered = [...others];
          reordered.splice(newPos - 1, 0, { id: editId });

          await Promise.all(
            reordered.map((item, idx) => {
              const pos = idx + 1;
              const newRow = Math.ceil(pos / 3);
              const newCol = ((pos - 1) % 3) + 1;
              const orig = items.find(i => i.id === item.id);
              if (!orig || orig.row !== newRow || orig.col !== newCol) {
                const fd = new FormData();
                ['title', 'text', 'icon'].forEach(k => {
                  if (orig?.[k] != null && orig[k] !== '') fd.append(k, orig[k]);
                });
                fd.append('row', newRow);
                fd.append('col', newCol);
                return updateAbout(item.id, fd);
              }
              return Promise.resolve();
            })
          );
        }
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
                  <td style={{ textAlign: 'center' }}>
                    {(item.row && item.col) ? (item.row - 1) * 3 + item.col : '—'}
                  </td>
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
