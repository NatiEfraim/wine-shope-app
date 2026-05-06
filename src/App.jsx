import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import History from './pages/History';
import Admin from './pages/Admin';

export default function App() {
  const [userRole, setUserRole] = useState('customer');

  return (
    <Routes>
      <Route element={<MainLayout userRole={userRole} setUserRole={setUserRole} />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}