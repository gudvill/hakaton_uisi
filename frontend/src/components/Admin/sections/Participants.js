import { useEffect, useState } from "react";
import { getRegistrations } from "../../../api/registrationService";

export default function Participants() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    getRegistrations()
      .then(data => setRegistrations(data))
      .catch(err => console.error("Ошибка загрузки:", err));
  }, []);

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">УЧАСТНИКИ</h3>

      {registrations.map((team) => (
        <div key={team.id} style={{ marginBottom: "20px" }}>
          <h4>Команда: {team.name}</h4>
          <p>Учебное заведение: {team.institution}</p>

          <div>
            {team.participants?.map((p) => (
              <div key={p.id} style={{ paddingLeft: "10px" }}>
                <p>
                  {p.fio} | курс: {p.course} | роль: {p.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}