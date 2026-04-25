import { useState } from 'react';
import './photogallery.css';
import Header from '../Header/header';
import Footer from '../Footer/footer';

export default function PhotoGallery() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <>
      <Header
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        isRegistrationOpen={isRegistrationOpen}
        setIsRegistrationOpen={setIsRegistrationOpen}
      />
      <section className="photogallery container">
        <h2>ФОТОГАЛЕРЕЯ</h2>
      </section>
      <Footer />
    </>
  );
}
