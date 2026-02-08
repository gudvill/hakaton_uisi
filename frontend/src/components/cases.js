import './cases.css';

export default function Cases() {
  const casesData = [
    {
      id: 1,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'стартовый уровень',
      partner: 'ООО ИНСИС',
      number: '01'
    },
    {
      id: 2,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'продвинутый уровень',
      partner: 'ООО ИНСИС',
      number: '02'
    },
    {
      id: 3,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'продвинутый уровень',
      partner: 'ООО ИНСИС',
      number: '03'
    },
    {
      id: 4,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'продвинутый уровень',
      partner: 'ООО ИНСИС',
      number: '04'
    },
    {
      id: 5,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'продвинутый уровень',
      partner: 'ООО ИНСИС',
      number: '05'
    },
    {
      id: 6,
      title: 'Проектирование систем автоматической пожарной сигнализации',
      level: 'продвинутый уровень',
      partner: 'ООО ИНСИС',
      number: '06'
    }
  ];

  return (
    <section className="cases container">
      <h2>КЕЙСЫ</h2>
      <div className='cases_container'>
        {casesData.map((caseItem) => (
          <a className='case_card' key={caseItem.id} href={`/case/${caseItem.id}`}>
            <h3 className='case_header'>{caseItem.title}</h3>
            <span className='level'>{caseItem.level}</span>
            <p className='partner_name'>{caseItem.partner}</p>
            <p className='case_number'>{caseItem.number}</p>
          </a>
        ))}
        <div className='info-baner'>
          <div className='info-text'>
            <p>Стартовый уровень - для студентов 1-2 курсов.</p>
            <p>Продвинутый уровень - для студентов 3-5 курса и студентов магистратуры.</p>
          </div>
          <div className='info-image'>
              <img src='images/computer.png'></img>
          </div>
        </div>
      </div>
    </section>
  );
}
