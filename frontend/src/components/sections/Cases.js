import React from 'react';
import './Cases.css';

const Cases = () => {
  const cases = [
    {
      title: "FinTech решения",
      description: "Разработка инновационных финансовых продуктов",
      technologies: ["React", "Node.js", "Blockchain"],
      image: "/images/case1.jpg"
    },
    {
      title: "EdTech платформа",
      description: "Создание образовательной платформы будущего",
      technologies: ["Vue.js", "Python", "AI/ML"],
      image: "/images/case2.jpg"
    },
    {
      title: "HealthTech приложение",
      description: "Мобильное приложение для мониторинга здоровья",
      technologies: ["React Native", "IoT", "Cloud"],
      image: "/images/case3.jpg"
    }
  ];

  return (
    <section className="cases" id="cases">
      <div className="container">
        <h2 className="section-title">Кейсы для решения</h2>
        <p className="section-subtitle">
          Выберите направление и создайте прорывное решение
        </p>
        <div className="cases-grid">
          {cases.map((caseItem, index) => (
            <div key={index} className="case-card">
              <div className="case-image">
                <img src={caseItem.image} alt={caseItem.title} />
              </div>
              <div className="case-content">
                <h3 className="case-title">{caseItem.title}</h3>
                <p className="case-description">{caseItem.description}</p>
                <div className="case-technologies">
                  {caseItem.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;