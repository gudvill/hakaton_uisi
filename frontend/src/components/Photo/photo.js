import './photo.css';
import { useRef, useEffect } from 'react';

const photos = Array(9).fill('/images/photo.png');

const SLIDE_INTERVAL = 2500;
const DRAG_THRESHOLD = 30;

export default function Photo() {
  const trackRef = useRef(null);
  const autoTimer = useRef(null);
  const currentIndex = useRef(0);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);

  const getItemWidth = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const item = track.querySelector('.photo-item');
    if (!item) return 0;
    return item.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 16);
  };

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const maxIndex = photos.length - 3;
    currentIndex.current = Math.max(0, Math.min(index, maxIndex));
    track.style.scrollBehavior = 'smooth';
    track.scrollLeft = currentIndex.current * getItemWidth();
  };

  const startAuto = () => {
    stopAuto();
    autoTimer.current = setInterval(() => {
      const maxIndex = photos.length - 3;
      goTo(currentIndex.current >= maxIndex ? 0 : currentIndex.current + 1);
    }, SLIDE_INTERVAL);
  };

  const stopAuto = () => clearInterval(autoTimer.current);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    trackRef.current.style.scrollBehavior = 'auto';
    stopAuto();
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    dragDelta.current = dragStartX.current - e.clientX;
    trackRef.current.scrollLeft = currentIndex.current * getItemWidth() + dragDelta.current;
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (dragDelta.current > DRAG_THRESHOLD) {
      goTo(currentIndex.current + 1);
    } else if (dragDelta.current < -DRAG_THRESHOLD) {
      goTo(currentIndex.current - 1);
    } else {
      goTo(currentIndex.current);
    }

    startAuto();
  };

  return (
    <section className="photo container">
      <h2>ФОТОАЛЬБОМ</h2>
      <div
        className="photo-track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {photos.map((src, i) => (
          <div className="photo-item" key={i}>
            <img src={src} alt={`фото ${i + 1}`} draggable={false} />
          </div>
        ))}
      </div>
      <a>Все фотографии</a>
    </section>
  );
}
