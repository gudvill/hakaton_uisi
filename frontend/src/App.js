import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header/header';
import Hero from './components/Hero/hero';
import Time from './components/Time/time';
import Cases from './components/Cases/cases';
import About from './components/About/about';
import Partners from './components/Partners/partners';
import Program from './components/Program/program';
import Contacts from './components/Contacts/contacts';
import News from './components/News/news';
import Faq from './components/Faq/faq';
import Photo from './components/Photo/photo';
import Footer from './components/Footer/footer';
import AdminRoute from './routes/AdminRoute';
import Login from './components/Admin/login';
import Admin from './components/Admin/admin';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Time />
      <Cases />
      <About />
      <Partners />
      <div className="program-contacts-wrapper">
        <Program />
        <Contacts />
      </div>
      <News />
      <Faq />
      <Photo />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
		      {/* сайт */}
          <Route path="/" element={<Home />} />

          {/* логин */}
          <Route path="/admin/login" element={<Login />} />

          {/* админка */}
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}