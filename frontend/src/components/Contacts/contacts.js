import './contacts.css';
import FadeIn from '../FadeIn/FadeIn';

export default function Contacts() {
  return (
    <section className='contacts container'>
      <FadeIn variant="fadeUp">
        <h2>ЕСТЬ ВОПРОСЫ?</h2>
      </FadeIn>
      <div className='contacts-wrapper'>
        <FadeIn variant="fadeLeft" duration={0.6}>
          <div className='contacts-text'>
            <p>Позвоните нам по телефону</p>
            <p>Мы перезвоним в течение рабочего дня и предоставим всю информацию</p>
          </div>
        </FadeIn>
        <FadeIn variant="fadeRight" duration={0.6} delay={0.1}>
          <div className='phone-number'>
            <p>+7 (343) 305-30-66</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
