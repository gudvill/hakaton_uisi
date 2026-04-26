import { useState, useEffect, useCallback } from 'react';
import './photogallery.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';

const STATIC_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  url: '/images/photo.png',
}));

export default function PhotoGallery() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const photos = STATIC_PHOTOS;
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => setLightbox(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  const current = lightbox !== null ? photos[lightbox] : null;

  return (
    <>
      <Header
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        isRegistrationOpen={isRegistrationOpen}
        setIsRegistrationOpen={setIsRegistrationOpen}
      />

      <section className="photogallery container">
        <h2>ФОТОГАЛЕРЕЯ</h2>

        <div className="photogallery__grid">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photogallery__item" onClick={() => openLightbox(index)}>
              <img src={photo.url} alt="" loading="lazy" />
              <div className="photogallery__overlay"><span>&#x2B;</span></div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {lightbox !== null && current && (
        <div className="photogallery__lightbox" onClick={closeLightbox}>
          <button className="photogallery__lb-close" onClick={closeLightbox}>✕</button>
          <div className="photogallery__lb-content" onClick={(e) => e.stopPropagation()}>
            <img src={current.url} alt="" />
          </div>
        </div>
      )}
    </>
  );
}
