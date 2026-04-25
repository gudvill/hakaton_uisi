import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../../api/newsService';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './news.css';
import './NewsAllPage.css';

const PER_PAGE = 20;

export default function NewsAllPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const set = new Set(news.map(n => new Date(n.created_at).getFullYear()));
    return [...set].sort((a, b) => b - a);
  }, [news]);

  const filtered = useMemo(() => {
    const result = activeYear
      ? news.filter(n => new Date(n.created_at).getFullYear() === activeYear)
      : news;
    return result;
  }, [news, activeYear]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const setYear = (year) => { setActiveYear(year); setPage(1); };
  const goTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  }, [page, totalPages]);

  return (
    <>
      <Header />
      <main className="news-all container">
        <div className="news-all__header">
          <h2>НОВОСТИ</h2>
          {!loading && years.length > 0 && (
            <div className="news-all__years">
              <button
                className={`news-all__year-btn ${activeYear === null ? 'news-all__year-btn--active' : ''}`}
                onClick={() => setYear(null)}
              >
                Все
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`news-all__year-btn ${activeYear === year ? 'news-all__year-btn--active' : ''}`}
                  onClick={() => setYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="news-all__loading">Загрузка...</p>
        ) : (
          <>
            <div className="news-grid">
              {paginated.map((item) => (
                <div key={item.id} className="news-card-wrapper">
                  <Link className="news-card" to={`/news/${item.id}`}>
                    <div className="news-card__img-wrap">
                      <img className="news-card__img" src={item.image} alt={item.name} />
                    </div>
                    <div className="news-card__body">
                      <p className="news-card__date">{formatDate(item.created_at)}</p>
                      <p className="news-card__title">{item.name}</p>
                      <p className="news-card__text">{item.brief_description}</p>
                      <span className="news-card__link">перейти →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="news-all__pagination">
                <button
                  className="news-all__page-btn news-all__page-arrow"
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                >
                  ←
                </button>

                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="news-all__page-ellipsis">…</span>
                  ) : (
                    <button
                      key={p}
                      className={`news-all__page-btn ${page === p ? 'news-all__page-btn--active' : ''}`}
                      onClick={() => goTo(p)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  className="news-all__page-btn news-all__page-arrow"
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
