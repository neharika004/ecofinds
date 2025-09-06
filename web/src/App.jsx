import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Listings from './pages/Listings';
import AddListing from './pages/AddListing';
import MyListings from './pages/MyListings';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/Cart';
import Purchases from './pages/Purchases';
import Header from './components/Header';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('ecofinds_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/listings" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/add" element={<RequireAuth><AddListing /></RequireAuth>} />
          <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
          <Route path="/listings/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/purchases" element={<RequireAuth><Purchases /></RequireAuth>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

