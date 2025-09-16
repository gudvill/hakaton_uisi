import React from 'react';
import Header from '../components/sections/Header';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Statistics from '../components/sections/Statistics';
import Cases from '../components/sections/Cases';
import PhotoGallery from '../components/sections/PhotoGallery';
import Reviews from '../components/sections/Reviews';
import Consultation from '../components/sections/Consultation';
import News from '../components/sections/News';
import FAQ from '../components/sections/FAQ';
import Footer from '../components/sections/Footer';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <About />
      <Statistics />
      <Cases />
      <PhotoGallery />
      <Reviews />
      <Consultation />
      <News />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;