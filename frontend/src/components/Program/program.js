import './program.css';
import { useState, useEffect } from "react";
import { getProgram } from "../../api/programService";

export default function Program() {
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const data = await getProgram();
        setProgramData(data);
      } catch (err) {
        setError("Ошибка загрузки программы");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, []);

  if (loading) return <div className='container'>Загрузка...</div>;
  if (error) return <div className='container'>{error}</div>;

  return (
    <section className='program container'>
      <h2>ПРОГРАММА ХАКАТОНА</h2>
      {programData.map((item) => (
        <div className='program-card' key={item.id}>
          <p className='date'>{item.date}</p>
          <p className='program-text'>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
