import React, { useState } from 'react';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photos = [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
    "/images/gallery6.jpg"
  ];

  return (
    <section className="photo-gallery" id="photos">
      <div className="container">
        <h2 className="section-title">Фотоальбом</h2>
        <p className="section-subtitle">Моменты с прошлых хакатонов</p>
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo} alt={`Фото ${index + 1}`} />
              <div className="gallery-overlay">
                <span>📷</span>
              </div>
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="modal" onClick={() => setSelectedPhoto(null)}>
            <div className="modal-content">
              <img src={selectedPhoto} alt="Увеличенное фото" />
              <button
                className="modal-close"
                onClick={() => setSelectedPhoto(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;