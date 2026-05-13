import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import History from './pages/History';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register'; 
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}> 
        {/* Public routes - Accessible to everyone */}
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - Requires authentication (Any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* Admin routes - Requires Admin (1) or Moderator (2) roles */}
        <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Super Admin routes - Requires Admin (1) role ONLY */}
        <Route element={<ProtectedRoute allowedRoles={[1]} />}>
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}