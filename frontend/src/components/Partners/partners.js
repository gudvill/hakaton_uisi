import './partners.css';
import { useEffect, useState } from 'react';
import { getPartners } from '../../api/partnersService';

export default function Partners() {
  const [partnersData, setPartnersData] = useState([]);

  useEffect(() => {
    getPartners()
      .then(data => setPartnersData(data))
      .catch(err => console.error("Ошибка загрузки партнёров:", err));
  }, []);

  return (
    <section className="partners container">
      <h2>ПАРТНЕРЫ</h2>
      <div className="partners-grid">
        {partnersData.map((partner) => (
          <div className="partner-card" key={partner.id}>
            <img src={partner.image} alt={partner.name} />
            <p className="partner-description">{partner.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
