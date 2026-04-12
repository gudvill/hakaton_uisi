import './reviews.css';

const reviewsData = [
  {
    id: 1,
    photo: '/images/photo_rewie.png',
    text: 'Команда кот будущего на Всероссийском хакатоне - яркий пример того Команда кот будущего на Всероссийском хакатоне - яркий пример того на',
  },
  {
    id: 2,
    photo: '/images/photo_rewie.png',
    text: 'Команда кот будущего на Всероссийском хакатоне - яркий пример того Команда кот будущего на Всероссийском хакатоне - яркий пример того на',
  },
  {
    id: 3,
    photo: '/images/photo_rewie.png',
    text: 'Команда кот будущего на Всероссийском хакатоне - яркий пример того Команда кот будущего на Всероссийском хакатоне - яркий пример того на',
  },
];

export default function Reviews() {
  return (
    <section className="reviews container">
      <h2>ОТЗЫВЫ</h2>
      <div className="reviews-grid">
        {reviewsData.map((review) => (
          <div className="folder-card" key={review.id}>

            {/* Задняя часть папки */}
            <img className="folder-back" src="/images/papka_back.svg" alt="" />

            {/* Фото — выезжает наверх при hover */}
            <img className="folder-photo" src={review.photo} alt="фото отзыва" />

            {/* Передняя часть папки — перекрывает низ фото */}
            <img className="folder-front" src="/images/papka_front.svg" alt="" />

            {/* Текст отзыва */}
            <p className="folder-text">{review.text}</p>

          </div>
        ))}
      </div>
    </section>
  );
}
