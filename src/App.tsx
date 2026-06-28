import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Tools from '@/pages/Tools';
import Resources from '@/pages/Resources';
import Navigation from '@/pages/Navigation';
import About from '@/pages/About';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/about" element={<About />} />
        <Route path="/_manage" element={<Admin />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
