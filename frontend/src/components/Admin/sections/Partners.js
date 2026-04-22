import '../../Partners/partners.css';
import { useEffect, useState } from 'react';
import { getPartners } from '../../../api/partnersService';

export default function Partners() {
  const [partnersData, setPartnersData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPartners()
      .then(data => setPartnersData(data))
      .catch(err => console.error("Ошибка загрузки партнёров:", err));
  }, []);

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ПАРТНЕРЫ</h3>
      <div className="partners-grid">
        {partnersData.map((partner) => (
          <div
            className="partner-card"
            key={partner.id}
            onClick={() => setSelected(partner)}
          >
            <img src={partner.image} alt={partner.name} />
            <p className="partner-description">{partner.description}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="partner-modal-overlay" onClick={() => setSelected(null)}>
          <div className="partner-modal" onClick={e => e.stopPropagation()}>
            <button className="partner-modal__close" onClick={() => setSelected(null)}>✕</button>
            <div className="partner-modal__img-wrap">
              <img src={selected.image} alt={selected.name} />
            </div>
            <h3 className="partner-modal__name">{selected.name}</h3>
            <p className="partner-modal__desc">{selected.description}</p>
            {selected.site && (
              <a className="partner-modal__site" href={selected.site} target="_blank" rel="noreferrer">
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
