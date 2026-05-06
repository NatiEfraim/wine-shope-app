import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import History from './pages/History';
import Admin from './pages/Admin';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      {}
      <Route element={<MainLayout />}> 
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}