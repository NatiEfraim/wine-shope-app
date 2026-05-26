import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Cart = lazy(() => import('./pages/Cart'));
const History = lazy(() => import('./pages/History'));
const Admin = lazy(() => import('./pages/Admin'));
const Register = lazy(() => import('./pages/Register'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));

function PageFallback() {
  return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-burgundy mx-auto"></div>
      <p className="mt-4 text-boutique-muted">טוען...</p>
    </div>
  );
}

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
          <Route path="/register" element={<Suspense fallback={<PageFallback />}><Register /></Suspense>} />
          
          {/* Protected routes - Requires authentication (Any logged-in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Suspense fallback={<PageFallback />}><Cart /></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<PageFallback />}><Checkout /></Suspense>} />
            <Route path="/checkout-success" element={<Suspense fallback={<PageFallback />}><CheckoutSuccess /></Suspense>} />
            <Route path="/history" element={<Suspense fallback={<PageFallback />}><History /></Suspense>} />
          </Route>

          {/* Admin routes - Requires Admin (1) or Moderator (2) roles */}
          <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
            <Route path="/admin" element={<Suspense fallback={<PageFallback />}><Admin /></Suspense>} />
          </Route>

          {/* Super Admin routes - Requires Admin (1) role ONLY */}
          <Route element={<ProtectedRoute allowedRoles={[1]} />}>
            <Route path="/admin/users" element={<Suspense fallback={<PageFallback />}><UserManagement /></Suspense>} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
