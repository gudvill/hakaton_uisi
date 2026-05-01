import './Photos.css';
import { useState, useEffect } from 'react';
import { getPhotoAlbums, createPhotoAlbum, updatePhotoAlbum, deletePhotoAlbum, uploadPhoto, deletePhoto } from '../../../../api/photoAlbumsService';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function Photos() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getPhotoAlbums();
    setAlbums(data);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name });
  };

  const startAdd = () => {
    setEditId('new');
    setForm({ name: '' });
  };

  const cancel = () => {
    setEditId(null);
    setForm({});
  };

  const save = async () => {
    try {
      if (editId === 'new') {
        await createPhotoAlbum(form);
      } else {
        await updatePhotoAlbum(editId, form);
      }
      await load();
      cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const del = async (id) => {
    await deletePhotoAlbum(id);
    await load();
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!selected) return;
    await Promise.all(files.map(file => uploadPhoto(selected.id, file)));
    await load();
  };

  if (selected) {
    const album = albums.find(a => a.id === selected.id);
    if (!album) return null;

    return (
      <div className="admin-card">
        <div className="section-header">
          <button onClick={() => setSelected(null)}><ChevronLeftIcon /></button>
          <h3>{album.name}</h3>
        </div>
        <input type="file" multiple onChange={handleUpload} />
        <div className="photos-grid">
          {album.photos?.map(photo => (
            <div key={photo.id}>
              <img src={`${API_URL}${photo.path}`} alt="" />
              <button onClick={async () => { await deletePhoto(photo.id); await load(); }}>удалить</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="section-header">
        <h3>ФОТОАЛЬБОМЫ</h3>
        <button onClick={startAdd}><PlusIcon /> альбом </button>
      </div>
      {editId && (
        <div>
          <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Название" />
          <button onClick={save}>сохранить</button>
          <button onClick={cancel}>отмена</button>
        </div>
      )}
      <div className="albums-grid">
        {albums.map(album => (
          <div key={album.id} onClick={() => setSelected(album)}>
            <PhotoIcon />
            <p>{album.name}</p>
            <button onClick={(e) => { e.stopPropagation(); startEdit(album); }} >изменить</button>
            <button onClick={(e) => { e.stopPropagation(); del(album.id); }} >удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}