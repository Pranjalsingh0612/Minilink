import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1>Minilink</h1>
          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Dashboard
            </Link>
            <Link to="/healthz" className={`nav-link ${isActive('/healthz')}`}>
              Health Check
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
