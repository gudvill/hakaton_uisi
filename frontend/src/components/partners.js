import './partners.css';

export default function Partners() {
  const partnersData = [
    { id: 1, name: 'Партнер 1', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 2, name: 'Партнер 2', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 3, name: 'Партнер 3', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 4, name: 'Партнер 4', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 5, name: 'Партнер 5', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 6, name: 'Партнер 6', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 7, name: 'Партнер 7', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 8, name: 'Партнер 8', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 9, name: 'Партнер 9', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 10, name: 'Партнер 10', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
    { id: 11, name: 'Партнер 11', logo: 'images/logo_partner.png', description: 'Уральский банк реконструкции и развития' },
  ];

  return (
    <section className="partners container">
      <h2>ПАРТНЕРЫ</h2>
      <div className="partners-grid">
        {partnersData.map((partner) => (
          <div className="partner-card" key={partner.id}>
            <img src={partner.logo} alt={partner.name} />
            <p className="partner-description">{partner.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
