import './about.css';

export default function About() {
  return (
    <section className="about container">
        <h2>О ХАКАТОНЕ</h2>
        <div className='about-div'>
            <p>Хакатон — это марафон, где технологические энтузиасты за короткий срок превращают идеи в рабочие прототипы. </p>
            <img src='images/gif.png' alt='gif'></img>
        </div>
        <div className='about-text'><p>В состав стандартной команды входят разработчики, дизайнеры и менеджеры. Обычно мероприятие занимает от 24 до 48 часов непрерывной работы.</p></div>
    </section>
  );
}