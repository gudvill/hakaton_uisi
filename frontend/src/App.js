import './App.css';
import Header from './components/header';
import Hero from './components/hero';
import Time from './components/time';
import Cases from './components/cases';

export default function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Hero />
      <Time />
      <Cases />
    </div>
  )
}