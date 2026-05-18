import './footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
    <div className='footer-container container'>
        <div className="logo">
        <img src='/images/logo2.svg'></img>
        <p>ВСЕРОССИЙСКИЙ ХАКАТОН СВЯЗИ</p>
        </div>
        <div className='social-icon'>
            <a href='https://t.me/vth2023'><img src='images/telegram.svg' alt='Телеграм'></img></a>
            <a href='https://vk.com/hakatonurtisi'><img src='images/vk.svg' alt='Вконтакте'></img></a>
            <a href='#'><img src='images/max.svg' alt='Макс'></img></a>
        </div>
        <div>
            <p>priem@urtisi.ru<br/>laa@urtisi.ru</p>
        </div>
        <div className='footer-contact'>
            <p>+7 (343) 305-30-66</p>
            <p>г. Екатеринбург, ул. Репина, д. 15</p>
        </div>
    </div>
    <div className='politics'>
      <Link to="/privacy-policy">Политика конфиденциальности</Link>
      <Link to="/UserAgreement">Пользовательское соглашение</Link>
    </div>
    <p className='copy'>© 2023 - {new Date().getFullYear()} ВСЕРОССИЙСКИЙ ХАКАТОН СВЯЗИ</p>
    </footer>
  );
}
