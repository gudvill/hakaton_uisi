import './contacts.css';

export default function Contacts() {
return (
    <section className='contacts container'>
      <h2>ЕСТЬ ВОПРОСЫ?</h2>
      <div className='contacts-wrapper'>
        <div className='contacts-text'>
          <p>Позвоните нам по телефону</p>
          <p>Мы перезвоним в течение рабочего дня и предоставим всю информацию</p>
        </div>
        <div className='phone-number'>
          <p>+7 (343) 305-30-66</p>
        </div>
      </div>
    </section>
);
}
