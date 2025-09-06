import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { me } from '../api/auth';
import logo from '../assets/logo.svg';

export default function Header() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('ecofinds_token');
    if (t) {
      me()
        .then(setUser)
        .catch(() => { localStorage.removeItem('ecofinds_token'); setUser(null); });
    }
  }, []);

  function logout() {
    localStorage.removeItem('ecofinds_token');
    setUser(null);
    nav('/login');
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <Link to="/listings" className="flex items-center gap-3">
            <img src={logo} alt="EcoFinds" style={{height:40}} />
            <div className="logo-text">
              <div className="text-lg font-bold">EcoFinds</div>
              <div className="kicker">Second-hand Marketplace</div>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/listings" className="text-sm">Browse</Link>
          <Link to="/add" className="text-sm">+ Add</Link>
          <Link to="/cart" className="text-sm">Cart</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-sm px-3 py-1 border rounded">{user.username}</Link>
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/signup" className="text-sm btn-outline ml-2">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
