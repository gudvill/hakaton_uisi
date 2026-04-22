import { useEffect, useState } from "react";
import { getAcquaintanceByTitle } from "../../../api/acquaintanceService";
import '../../Policy/policy.css';

export default function Policy() {
  const [policy, setPolicy] = useState(null);
  const [agreement, setAgreement] = useState(null);

  // Политика
  useEffect(() => {
    getAcquaintanceByTitle("Политика конфиденциальности")
      .then(data => setPolicy(data))
      .catch(err => console.error(err));
  }, []);

  // Соглашение
  useEffect(() => {
    getAcquaintanceByTitle("Пользовательское соглашение")
      .then(data => setAgreement(data))
      .catch(err => console.error(err));
  }, []);

  if (!policy || !agreement) return <p>Загрузка...</p>;

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ПОЛИТИКА И СОГЛАШЕНИЕ</h3>
      <section>
        <h3 className="policy__title">{policy.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: policy.text }} />
      </section>
      <section style={{ marginTop: '40px' }}>
        <h3 className="policy__title">{agreement.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: agreement.text }} />
      </section>
    </div>
  );
}