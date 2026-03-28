import './about.css';
import { useState, useEffect } from "react";
import { getAbout } from "../../api/aboutService";

export default function About() {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const data = await getAbout();
        setAboutData(data);
      } catch (err) {
        setError("Ошибка загрузки описания");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) return <div className="about container">Загрузка...</div>;
  if (error) return <div className="about container">{error}</div>;

  return (
    <section className="about container">
      <h2>О ХАКАТОНЕ</h2>
      {aboutData.map((item, index) => (
        <div key={item.id} className={index === 0 ? 'about-div' : 'about-text'}>
          <p>{item.text}</p>
          {index === 0 && <img src='images/gif.png' alt='gif' />}
        </div>
      ))}
    </section>
  );
}