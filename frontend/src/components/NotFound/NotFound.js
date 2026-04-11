import { useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="notfound-page">
        <div className="notfound-content">
          <img src="/images/404.svg" alt="404" className="notfound-code" />
          <h1 className="notfound-title">СТРАНИЦА НЕ НАЙДЕНА</h1>
          <button className="notfound-button" onClick={() => navigate('/')}>
            ВЕРНУТЬСЯ НА ГЛАВНУЮ
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
