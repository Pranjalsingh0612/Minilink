import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import HealthCheck from './pages/HealthCheck';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<Stats />} />
          <Route path="/healthz" element={<HealthCheck />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
