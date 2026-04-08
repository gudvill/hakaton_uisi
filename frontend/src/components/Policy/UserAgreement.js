import { useEffect, useState } from "react";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import { getAcquaintanceById } from "../../api/acquaintanceService";
import './policy.css';

export default function UserAgreement() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    getAcquaintanceById(2)
      .then(data => setPage(data))
      .catch(err => console.error(err));
  }, []);

  if (!page) return <p>Загрузка...</p>;
  return (
    <>
      <Header />
      <main className="policy container">
        <h1 className="policy__title">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.text }} />
      </main>
      <Footer />
    </>
  );
}
