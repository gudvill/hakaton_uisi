import '../../Program/program.css';
import { useState, useEffect } from "react";
import { getProgram } from "../../../api/programService";


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

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const monthNames = [
      'января','февраля','марта','апреля','мая','июня',
      'июля','августа','сентября','октября','ноября','декабря'
    ];

    const startDay = startDate.getDate();
    const startMonth = monthNames[startDate.getMonth()];

    if (!endDate) {
      return `${startDay} ${startMonth}`;
    }

    const endDay = endDate.getDate();
    const endMonth = monthNames[endDate.getMonth()];

    if (startMonth === endMonth) {
      return `${startDay}–${endDay} ${startMonth}`;
    }

    return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
  };
  return (
    <div className="admin-card">
      <h3 className="admin-card-title">ПРОГРАММА</h3>
      {programData.map((item) => (
        <div className='program-card' key={item.id}>
          <p className='date'>{formatDateRange(item.start_date, item.end_date)}</p>
          <p className='program-text'>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
