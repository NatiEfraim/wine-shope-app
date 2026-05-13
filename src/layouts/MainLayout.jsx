import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Settings, LogOut, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function MainLayout() {
  const cartCount = useCartStore((state) => 
    state.cart.reduce((total, item) => total + item.qty, 0)
  );
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if the user has an Admin (1) or Moderator (2) role
  const isManagerOrAdmin = user?.role?.some(r => r.id === 1 || r.id === 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-red-800 flex items-center gap-2">
              <Package size={28}/> WINE STORE
            </Link>
            
            <div className="hidden md:flex gap-6">
              <Link to="/" className="transition-colors font-medium text-slate-500 hover:text-slate-800">
                חנות
              </Link>
              
              {/* Visible to any logged-in user */}
              {isAuthenticated && (
                <Link to="/history" className="transition-colors font-medium text-slate-500 hover:text-slate-800">
                  הזמנות שלי
                </Link>
              )}
              
              {/* Visible only to Admins and Moderators */}
              {isManagerOrAdmin && (
                <Link to="/admin" className="transition-colors font-medium flex items-center gap-1 text-slate-500 hover:text-slate-800">
                  ממשק ניהול <Settings size={14}/>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
               <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                 <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <User size={16} className="text-slate-400" /> 
                    {user?.name || 'אורח'}
                 </span>
                 <div className="w-px h-4 bg-slate-200"></div>
                 <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                   <LogOut size={16}/> התנתק
                 </button>
               </div>
            ) : (
               <Link to="/login" className="text-sm font-bold text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">
                 התחברות
               </Link>
            )}
            
            <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
              <ShoppingCart size={24} className="text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-20 border-t py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 Wine System - פרויקט גמר FSD</p>
        </div>
      </footer>
    </div>
  );
}