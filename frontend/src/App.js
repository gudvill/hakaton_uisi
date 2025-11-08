import './App.css';
import Header from './components/header';
import Hero from './components/hero';
import Time from './components/time';

export default function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Hero />
      <Time />
    </div>
  )
}