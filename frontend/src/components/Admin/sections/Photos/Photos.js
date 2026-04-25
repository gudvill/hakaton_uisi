import './Photos.css';
import { useState, useEffect } from 'react';
import { getPhotoAlbums } from '../../../../api/photoAlbumsService';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function Photos() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getPhotoAlbums().then(setAlbums).catch(console.error);
  }, []);

  const startEdit = (item) => { setEditId(item.id); setForm(item); };
  const startAdd  = () => { setEditId('new'); setForm({ name: '', description: '' }); };
  const cancel    = () => { setEditId(null); setForm({}); };
  const save = () => {
    if (editId === 'new') {
      setAlbums(p => [...p, { ...form, id: Date.now(), photos: [] }]);
    } else {
      setAlbums(p => p.map(a => a.id === editId ? { ...a, ...form } : a));
    }
    cancel();
  };
  const del = (id) => { setAlbums(p => p.filter(a => a.id !== id)); if (selected?.id === id) setSelected(null); };

  const inp = (key, placeholder) => (
    <input className="section-input" value={form[key] || ''} placeholder={placeholder}
      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
  );

  const EditCard = () => (
    <div className="album-edit-card">
      {inp('name', 'Название альбома')}
      {inp('description', 'Описание')}
      <div className="section-row-actions" style={{ marginTop: 4 }}>
        <button className="section-save-btn" onClick={save}>сохранить</button>
        <button className="section-cancel-btn" onClick={cancel}>отмена</button>
      </div>
    </div>
  );

  if (selected) {
    const album = albums.find(a => a.id === selected.id) || selected;
    return (
      <div className="admin-card">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="section-icon-btn section-icon-btn--edit" onClick={() => setSelected(null)}>
              <ChevronLeftIcon style={{ width: 18, height: 18 }} />
            </button>
            <h3 className="admin-card-title" style={{ marginBottom: 0 }}>{album.name}</h3>
          </div>
        </div>
        {(!album.photos || album.photos.length === 0)
          ? <p className="section-empty">Нет фотографий в альбоме</p>
          : <div className="photos-grid">
              {album.photos.map((ph, i) => (
                <div key={i} className="photo-thumb">
                  <img src={ph.url || ph} alt="" />
                </div>
              ))}
            </div>
        }
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>ФОТОАЛЬБОМ</h3>
        <button className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} /> альбом
        </button>
      </div>
      <div className="albums-grid">
        {editId === 'new' && <EditCard />}
        {albums.length === 0 && editId !== 'new' && <p className="section-empty">Нет альбомов</p>}
        {albums.map(album => editId === album.id ? (
          <EditCard key={album.id} />
        ) : (
          <div key={album.id} className="album-card" onClick={() => setSelected(album)}>
            <div className="album-cover">
              {album.photos?.[0]
                ? <img src={album.photos[0].url || album.photos[0]} alt="" />
                : <PhotoIcon style={{ width: 32, height: 32, color: '#d4c8ff' }} />
              }
            </div>
            <div className="album-info">
              <p className="album-name">{album.name}</p>
              <p className="album-count">{album.photos?.length || 0} фото</p>
            </div>
            <div className="album-actions" onClick={e => e.stopPropagation()}>
              <button className="section-icon-btn section-icon-btn--edit" onClick={() => startEdit(album)}>
                <PencilIcon style={{ width: 14, height: 14 }} />
              </button>
              <button className="section-icon-btn section-icon-btn--delete" onClick={() => del(album.id)}>
                <TrashIcon style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
