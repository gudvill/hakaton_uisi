import './partners.css';
import { useEffect, useState } from 'react';

export default function Partners() {
  const [partnersData, setPartnersData] = useState([]);

  useEffect(() => {
    fetch("/api/partners/")
      .then(res => {
        if (!res.ok) throw new Error("Ошибка API");
        return res.json();
      })
      .then(data => setPartnersData(data))
      .catch(err => console.error("Ошибка загрузки партнёров:", err));
  }, []);

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
