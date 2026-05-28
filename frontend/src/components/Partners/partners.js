import './partners.css';
import { useEffect, useState } from 'react';
import { getPartners } from '../../api/partnersService';

export default function Partners() {
  const [partnersData, setPartnersData] = useState([]);
  const [selected, setSelected] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    getPartners()
      .then(data => setPartnersData(data))
      .catch(err => console.error("Ошибка загрузки партнёров:", err));
  }, []);

  return (
    <section id="partners" className="partners container">
      <h2>ПАРТНЕРЫ</h2>
      <div className="partners-grid">
        {partnersData.map((partner) => (
          <div className="partner-card" key={partner.id} onClick={() => setSelected(partner)} >
            <img src={`${API_URL}${partner.image}`} alt={partner.name} />
            <p className="partner-name">{partner.name}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="partner-modal-overlay" onClick={() => setSelected(null)}>
          <div className="partner-modal" onClick={e => e.stopPropagation()}>
            <button className="partner-modal__close" onClick={() => setSelected(null)}><img src='images/close.svg'></img></button>
            <div className="partner-modal__img-wrap">
              <img src={`${API_URL}${selected.image}`} alt={selected.name} />
            </div>
            <h3 className="partner-modal__name">{selected.name}</h3>
            <p className="partner-modal__desc">{selected.description}</p>
            <a className="partner-modal__site" href={selected.site_link || '#'} target="_blank"rel="noreferrer" >Перейти на сайт</a>
          </div>
        </div>
      )}
    </section>
  );
}
