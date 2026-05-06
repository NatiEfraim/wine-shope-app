import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Package, ShoppingCart, Settings } from 'lucide-react';

export default function MainLayout({ cartCount, userRole, setUserRole }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-red-900 flex items-center gap-2">
              <Package size={28}/> WINE STORE
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="transition-colors font-medium text-slate-500 hover:text-slate-800">
                חנות
              </Link>
              <Link to="/history" className="transition-colors font-medium text-slate-500 hover:text-slate-800">
                הזמנות שלי
              </Link>
              {(userRole === 'admin' || userRole === 'editor') && (
                <Link to="/admin" className="transition-colors font-medium flex items-center gap-1 text-slate-500 hover:text-slate-800">
                  ממשק ניהול <Settings size={14}/>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button onClick={() => setUserRole('customer')} className={`px-2 py-1 rounded ${userRole === 'customer' ? 'bg-white shadow-sm' : ''}`}>לקוח</button>
              <button onClick={() => setUserRole('admin')} className={`px-2 py-1 rounded ${userRole === 'admin' ? 'bg-white shadow-sm' : ''}`}>אדמין</button>
            </div>
            
            <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area (This changes based on the route) */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 Wine System - פרויקט גמר FSD</p>
        </div>
      </footer>
    </div>
  );
}
