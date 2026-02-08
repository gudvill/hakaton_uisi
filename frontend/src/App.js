import './App.css';
import Header from './components/header';
import Hero from './components/hero';
import Time from './components/time';
import Cases from './components/cases';
import About from './components/about';
import Partners from './components/partners'

export default function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Hero />
      <Time />
      <Cases />
      <About />
      <Partners />
    </div>
  )
}