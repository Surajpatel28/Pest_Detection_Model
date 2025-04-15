import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import DetectionPage from './components/DetectionPage';
import HowItWorksPage from './components/HowItWorksPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#e8f5e9]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detection" element={<DetectionPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
