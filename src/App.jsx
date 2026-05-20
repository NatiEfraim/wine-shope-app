import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import History from './pages/History';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register'; 
import UserManagement from './pages/UserManagement';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      {/* Modern toast notification container configured with clean boutique-friendly styles */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1614', // boutique-charcoal
            color: '#FAF7F2',      // boutique-cream
            fontFamily: 'Montserrat, sans-serif',
            borderRadius: '2px',   // rounded-sm matching Meni's design
            border: '1px solid rgba(201, 169, 98, 0.2)', // thin gold border
          },
          success: {
            iconTheme: {
              primary: '#C9A962',  // boutique-gold
              secondary: '#1A1614',
            },
          },
          error: {
            iconTheme: {
              primary: '#5C2430',  // boutique-burgundy
              secondary: '#FAF7F2',
            },
          },
        }}
      />

      <Routes>
        <Route element={<MainLayout />}> 
          {/* Public routes - Accessible to everyone */}
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - Requires authentication (Any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
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
    </>
  );
}