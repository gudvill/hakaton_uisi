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
    <section className="cases">
      <h2>КЕЙСЫ</h2>
      <div className='cases_container container'>
        {casesData.map((caseItem) => (
          <div className='case_card' key={caseItem.id}>
            <div className='case_image'></div>
            <h3 className='case_header'>{caseItem.title}</h3>
            <button className='level'>{caseItem.level}</button>
            <p className='partner_name'>{caseItem.partner}</p>
            <p className='case_number'>{caseItem.number}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
