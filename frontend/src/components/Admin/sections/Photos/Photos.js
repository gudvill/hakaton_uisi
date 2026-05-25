import './Photos.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import { getPhotoAlbums, createPhotoAlbum, updatePhotoAlbum, deletePhotoAlbum, uploadPhoto, deletePhoto } from '../../../../api/photoAlbumsService';
import { getAdminYearOptions } from '../../yearRange';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon, ChevronLeftIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminSelect from '../../AdminSelect';

export default function Photos() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const fileInputRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || '';
  const years = useMemo(() => getAdminYearOptions(), []);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const params = {
        search: search || undefined,
        year: year ? Number(year) : undefined,
      };

      const data = await getPhotoAlbums(params);

      setAlbums(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (search === '' && year === '') return;
    const delay = setTimeout(() => {
      load();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, year]);

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
    if (!window.confirm('Удалить альбом?')) return;
    try {
      await deletePhotoAlbum(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!selected || files.length === 0) return;
    try {
      await Promise.all(files.map((file) => uploadPhoto(selected.id, file)));
      await load();
    } catch (err) {
      console.error(err);
    }
    e.target.value = '';
  };

  if (selected) {
    const album = albums.find((a) => a.id === selected.id);
    if (!album) {
      return (
        <div className="admin-card admin-photos-section">
          <p className="section-empty">Альбом не найден</p>
          <button type="button" className="section-cancel-btn" onClick={() => setSelected(null)}>
            к списку
          </button>
        </div>
      );
    }

    const count = album.photos?.length ?? 0;

    return (
      <div className="admin-card admin-photos-section">
        <div className="section-header admin-photos-album-header">
          <div className="admin-photos-album-header-left">
            <button
              type="button"
              className="admin-photos-back-btn"
              onClick={() => setSelected(null)}
              aria-label="Назад к альбомам"
            >
              <ChevronLeftIcon style={{ width: 20, height: 20 }} />
            </button>
            <div>
              <h3 className="admin-card-title admin-photos-album-title">{album.name}</h3>
              <span className="count-items">{count} {count === 1 ? 'фото' : 'фотографий'}</span>
            </div>
          </div>
          <div className="admin-photos-upload-wrap">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="admin-photos-file-input"
              onChange={handleUpload}
              accept="image/*"
            />
            <button type="button" className="section-add-btn" onClick={() => fileInputRef.current?.click()}>
              <ArrowUpTrayIcon style={{ width: 16, height: 16 }} />
              добавить фото
            </button>
          </div>
        </div>

        {count === 0 ? (
          <p className="section-empty admin-photos-empty-album">В альбоме пока нет фотографий</p>
        ) : (
          <div className="photos-grid">
            {album.photos?.map((photo) => (
              <div key={photo.id} className="photo-tile">
                <div className="photo-thumb">
                  <img src={`${API_URL}${photo.path}`} alt="" loading="lazy" />
                </div>
                <button
                  type="button"
                  className="section-icon-btn section-icon-btn--delete photo-tile-delete"
                  title="Удалить фото"
                  onClick={async () => {
                    if (!window.confirm('Удалить это фото?')) return;
                    try {
                      await deletePhoto(photo.id);
                      await load();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <TrashIcon style={{ width: 15, height: 15 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-card admin-photos-section">
      <div className="section-header">
        <h3 className="admin-card-title" style={{ marginBottom: 0 }}>
          ФОТОАЛЬБОМЫ
        </h3>
        <span className="count-items">
          {albums.length}{' '}
          {albums.length === 1 ? 'альбом' : 'альбомов'}
        </span>
        <button type="button" className="section-add-btn" onClick={startAdd}>
          <PlusIcon style={{ width: 16, height: 16 }} />
          альбом
        </button>
      </div>

      <div className="participants-filters">
        <div className="participants-search-wrap">
          <MagnifyingGlassIcon className="participants-search-icon" aria-hidden />
          <input
            className="participants-search"
            placeholder="Поиск по названию альбома..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="participants-search-clear" onClick={() => setSearch('')} aria-label="Очистить поиск">
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
        <AdminSelect value={year} onChange={setYear} options={years.map(y => ({ value: y, label: String(y) }))} placeholder="Год альбома" />
        {(search || year) && (
          <button
            type="button"
            className="participants-reset-btn"
            onClick={() => {
              setSearch('');
              setYear('');
            }}
          >
            сбросить
          </button>
        )}
      </div>

      {editId && (
        <div className="album-edit-card admin-photos-edit-card">
          <label className="admin-photos-label" htmlFor="photos-album-name">
            Название альбома
          </label>
          <input
            id="photos-album-name"
            className="section-input"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Например, Открытие хакатона"
          />
          <div className="section-row-actions" style={{ marginTop: 4 }}>
            <button type="button" className="section-save-btn" onClick={save}>
              сохранить
            </button>
            <button type="button" className="section-cancel-btn" onClick={cancel}>
              отмена
            </button>
          </div>
        </div>
      )}
      {albums.length === 0 ? (
        search || year ? (
          <p className="section-empty">
            Нет альбомов по заданным фильтрам
          </p>
        ) : (
          <p className="section-empty">
            Нет альбомов — создайте первый
          </p>
        )
      ) : (
        <div className="albums-grid">
          {albums.map((album) => {
            const cover = album.photos?.[0];
            const n = album.photos?.length ?? 0;
            return (
              <div
                key={album.id}
                className="album-card"
                role="button"
                tabIndex={0}
                onClick={() => setSelected({ id: album.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected({ id: album.id });
                  }
                }}
              >
                <div className="album-cover">
                  {cover ? (
                    <img src={`${API_URL}${cover.path}`} alt="" loading="lazy" />
                  ) : (
                    <PhotoIcon className="album-cover-placeholder-icon" aria-hidden />
                  )}
                </div>
                <div className="album-info">
                  <p className="album-name">{album.name}</p>
                  <p className="album-count">{n} {n === 1 ? 'фото' : 'фотографий'}</p>
                </div>
                <div className="album-actions">
                  <button
                    type="button"
                    className="section-icon-btn section-icon-btn--edit"
                    title="Переименовать"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(album);
                    }}
                  >
                    <PencilIcon style={{ width: 15, height: 15 }} />
                  </button>
                  <button
                    type="button"
                    className="section-icon-btn section-icon-btn--delete"
                    title="Удалить альбом"
                    onClick={(e) => {
                      e.stopPropagation();
                      del(album.id);
                    }}
                  >
                    <TrashIcon style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
