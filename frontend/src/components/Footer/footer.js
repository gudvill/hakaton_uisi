import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
    <div className='footer-container'>
        <div className="logo">
        <img src='images/logo2.svg'></img>
        <p>ВСЕРОССИЙСКИЙ ХАКАТОН СВЯЗИ</p>
        </div>
        <div className='social-icon'>
            <a href='#'><img src='images/#'></img></a>
            <a href='#'><img src='images/#'></img></a>
        </div>
        <div>
            <p>priem@urtisi.ru<br/>laa@urtisi.ru</p>
        </div>
        <div className='footer-contact'>
            <p>+7 (343) 305-30-66</p>
            <p>г. Екатеринбург, ул. Репина, д. 15</p>
        </div>
    </div>
    <p className='copy'>© 2023 - {new Date().getFullYear()} ВСЕРОССИЙСКИЙ ХАКАТОН СВЯЗИ</p>
    </footer>
  );
}
