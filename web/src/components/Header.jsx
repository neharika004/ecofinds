import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { me } from '../api/auth';

export default function Header() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('ecofinds_token');
    if (t) {
      me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('ecofinds_token');
          setUser(null);
        });
    }
  }, []);

  function logout() {
    localStorage.removeItem('ecofinds_token');
    setUser(null);
    nav('/login');
  }

  return (
    <header className="header">
      <div className="flex items-center gap-3">
        <Link to="/listings" className="font-bold text-lg">
          EcoFinds
        </Link>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Second-hand Marketplace
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/listings" className="text-sm">Browse</Link>
        <Link to="/add" className="text-sm">+ Add</Link>
        <Link to="/cart" className="text-sm">Cart</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm">{user.username}</Link>
            <button
              onClick={logout}
              className="text-sm text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/signup" className="text-sm">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
