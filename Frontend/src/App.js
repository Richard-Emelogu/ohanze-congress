import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import Store from './pages/store';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;