import './About.css';
import { useState, useEffect } from 'react';
import { getAbout, createAbout, updateAbout, deleteAbout } from '../../../../api/aboutService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function About() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  // загрузка данных
  const load = async () => {
    try {
      const data = await getAbout();
      setItems(
        [...data].sort(
          (a, b) => (a.row ?? 0) - (b.row ?? 0) || (a.col ?? 0) - (b.col ?? 0)
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // редактирование
  const startEdit = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  // добавление
  const startAdd = () => {
    setEditId('new');
    setForm({
      row: '',
      col: '',
      title: '',
      text: '',
      icon: ''
    });
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  // сохранение
  const save = async () => {
    try {
      if (editId === 'new') {
        await createAbout(form);
      } else {
        await updateAbout(editId, form);
      }

      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  // удаление
  const del = async (id) => {
    try {
      await deleteAbout(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const inp = (key, placeholder) => (
    <input
      className="section-input"
      value={form[key] || ''}
      placeholder={placeholder}
      onChange={(e) =>
        setForm((p) => ({ ...p, [key]: e.target.value }))
      }
    />
  );

  const EditRow = () => (
    <tr className="section-edit-row">
      <td>
        {form.icon ? (
          <img
            className="section-thumbnail"
            src={form.icon}
            alt=""
            style={{ objectFit: 'contain', background: '#f3f0ff' }}
          />
        ) : (
          <div
            style={{
              width: 44,
              height: 44,
              background: '#f3f0ff',
              borderRadius: 8
            }}
          />
        )}
      </td>

      <td>{inp('icon', 'URL иконки')}</td>
      <td>{inp('title', 'Заголовок')}</td>

      <td>
        <textarea
          className="section-textarea about-textarea"
          value={form.text || ''}
          placeholder="Описание"
          onChange={(e) =>
            setForm((p) => ({ ...p, text: e.target.value }))
          }
        />
      </td>
      <td>{inp('row', 'Row')}</td>
      <td>{inp('col', 'Col')}</td>

      <td>
        <div className="section-row-actions">
          <button className="section-save-btn" onClick={save}>
            сохранить
          </button>
          <button className="section-cancel-btn" onClick={cancel}>
            отмена
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>
          О ХАКАТОНЕ — ROADMAP
        </h3>

        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> добавить
        </button>
      </div>

      <div className="section-table-wrap">
        <table className="section-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Иконка</th>
              <th>Путь к фото</th>
              <th>Заголовок</th>
              <th>Описание</th>
              <th>По строке</th>
              <th>По столбцу</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {editId === 'new' && <EditRow />}

            {items.length === 0 && editId !== 'new' && (
              <tr>
                <td colSpan={7} className="section-empty">
                  Нет шагов
                </td>
              </tr>
            )}

            {items.map((item) =>
              editId === item.id ? (
                <EditRow key={item.id} />
              ) : (
                <tr key={item.id}>
                  <td>
                    {item.icon ? (
                      <img
                        className="section-thumbnail"
                        src={item.icon}
                        alt=""
                        style={{
                          objectFit: 'contain',
                          background: '#f3f0ff'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#ccc', fontSize: 12 }}>
                        нет
                      </span>
                    )}
                  </td>

                  <td
                    style={{
                      fontSize: 11,
                      color: '#aaa',
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.icon || '—'}
                  </td>

                  <td style={{ fontWeight: 600 }}>{item.title}</td>

                  <td className="about-text-cell">{item.text}</td>

                  <td>{item.row ?? '—'}</td>
                  <td>{item.col ?? '—'}</td>

                  <td>
                    <div className="section-row-actions">
                      <button
                        className="section-icon-btn section-icon-btn--edit"
                        onClick={() => startEdit(item)}
                      >
                        <PencilIcon style={{ width: 15, height: 15 }} />
                      </button>

                      <button
                        className="section-icon-btn section-icon-btn--delete"
                        onClick={() => del(item.id)}
                      >
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