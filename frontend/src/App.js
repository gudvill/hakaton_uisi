import './App.css';
import { Routes, Route } from 'react-router-dom';

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
import Reviews from './components/Reviews/reviews';
import Footer from './components/Footer/footer';
import AdminRoute from "./routes/AdminRoute";
import Login from './components/Admin/login';
import Admin from './components/Admin/admin';
import NewsAllPage from './components/News/NewsAllPage';
import NewsDetailPage from './components/News/NewsDetailPage';
import CaseDetailPage from './components/Cases/CaseDetailPage';
import PrivacyPolicy from './components/Policy/PrivacyPolicy';
import UserAgreement from './components/Policy/UserAgreement';
import PasswordResetRequestPage from './components/Admin/PasswordResetRequestPage';
import PasswordResetPage from './components/Admin/PasswordResetPage';

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
      <Reviews />
      <Photo />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="app-wrapper">
      <Routes>
		      {/* сайт */}
          <Route path="/" element={<Home />} />

          {/* новости */}
          <Route path="/news" element={<NewsAllPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />

          {/* кейсы */}
          <Route path="/case/:id" element={<CaseDetailPage />} />

          {/* политика */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/user-agreement" element={<UserAgreement />} />

          {/* логин */}
          <Route path="/admin/login" element={<Login />} />

          {/* восстановление доступа */}
          <Route path="/request-password-reset" element={<PasswordResetRequestPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />

          {/* админка */}
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
    </div>
  );
}