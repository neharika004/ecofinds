import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();
  // show only on small screens
  return (
    <nav className="fixed bottom-4 left-0 right-0 flex justify-center sm:hidden z-40">
      <div className="bg-white px-3 py-2 rounded-xl shadow-md flex gap-2 items-center">
        <NavButton to="/listings" active={pathname.startsWith('/listings')}>Browse</NavButton>
        <NavButton to="/add" active={pathname === '/add'}>Add</NavButton>
        <NavButton to="/cart" active={pathname === '/cart'}>Cart</NavButton>
      </div>
    </nav>
  );
}

function NavButton({ to, children, active }) {
  return (
    <Link to={to} className={`px-3 py-1 rounded-md text-sm ${active ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}>
      {children}
    </Link>
  );
}
