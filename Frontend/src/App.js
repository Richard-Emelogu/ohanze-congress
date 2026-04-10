import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import Store from './pages/store';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/leadership" element={<><Header /><Leadership /></>} />
          <Route path="/gallery" element={<><Header /><Gallery /></>} />
          <Route path="/store" element={<><Header /><Store /></>} />
          <Route path="/admin/login" element={<><Header /><AdminLogin /></>} />
          <Route path="/admin/register" element={<><Header /><AdminRegister /></>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;