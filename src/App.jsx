import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

// Layout and Pages
import MainLayout from './layouts/MainLayout';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import History from './pages/History';
import Admin from './pages/Admin';

export default function App() {
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState('customer'); // customer, admin, editor
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerNotification();
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }).filter(p => p.qty > 0));
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCheckout = () => {
    alert("הזמנה בוצעה בהצלחה! מייל אישור נשלח לכתובתך.");
    setCart([]);
    navigate('/history'); // Redirect to history after checkout
  };

  return (
    <>
      {/* Global Notification */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={20}/> המוצר נוסף לעגלה בהצלחה!
        </div>
      )}

      {/* Routing Configuration */}
      <Routes>
        <Route element={<MainLayout cartCount={cart.length} userRole={userRole} setUserRole={setUserRole} />}>
          <Route path="/" element={<Catalog onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} onUpdateQty={updateQty} onCheckout={handleCheckout} />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}
