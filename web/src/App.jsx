import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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
import BottomNav from './components/BottomNav';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('ecofinds_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/listings" replace />} />
        <Route path="/login" element={<PageMotion><Login /></PageMotion>} />
        <Route path="/signup" element={<PageMotion><Signup /></PageMotion>} />
        <Route path="/listings" element={<PageMotion><Listings /></PageMotion>} />
        <Route path="/add" element={<PageMotion><RequireAuth><AddListing /></RequireAuth></PageMotion>} />
        <Route path="/my-listings" element={<PageMotion><RequireAuth><MyListings /></RequireAuth></PageMotion>} />
        <Route path="/listings/:id" element={<PageMotion><ProductDetail /></PageMotion>} />
        <Route path="/dashboard" element={<PageMotion><RequireAuth><Dashboard /></RequireAuth></PageMotion>} />
        <Route path="/cart" element={<PageMotion><RequireAuth><CartPage /></RequireAuth></PageMotion>} />
        <Route path="/purchases" element={<PageMotion><RequireAuth><Purchases /></RequireAuth></PageMotion>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageMotion({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-container">
        <AnimatedRoutes />
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}
