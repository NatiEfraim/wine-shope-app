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

  // Check if the user has an Admin (1) or Moderator (2) role based on Spatie RBAC array
  const isManagerOrAdmin = user?.role?.some(r => r.id === 1 || r.id === 2);

  return (
    <div className="min-h-screen bg-boutique-cream text-boutique-ink font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-boutique-linen/80 bg-boutique-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-serif text-2xl font-bold tracking-tight text-boutique-burgundy"
            >
              <Package size={26} strokeWidth={1.25} className="text-boutique-gold-muted" />
              <span>WINE STORE</span>
            </Link>

            <div className="hidden gap-7 md:flex">
              <Link
                to="/"
                className="font-sans text-sm font-medium text-boutique-muted transition-colors hover:text-boutique-ink"
              >
                חנות
              </Link>

              {/* Visible to any logged-in user */}
              {isAuthenticated && (
                <Link
                  to="/history"
                  className="font-sans text-sm font-medium text-boutique-muted transition-colors hover:text-boutique-ink"
                >
                  הזמנות שלי
                </Link>
              )}

              {/* Visible only to Admins and Moderators */}
              {isManagerOrAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 font-sans text-sm font-medium text-boutique-muted transition-colors hover:text-boutique-ink"
                >
                  ממשק ניהול <Settings size={14} />
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 rounded-full border border-boutique-linen bg-white/60 px-3 py-1.5">
                <span className="flex items-center gap-1.5 font-sans text-sm font-medium text-boutique-ink">
                  <User size={16} className="text-boutique-muted" />
                  {user?.name || 'אורח'}
                </span>
                <div className="h-4 w-px bg-boutique-linen" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 font-sans text-sm text-boutique-muted transition-colors hover:text-boutique-burgundy"
                >
                  <LogOut size={16} /> התנתק
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-sm border border-boutique-burgundy/30 bg-boutique-burgundy px-4 py-2 font-sans text-sm font-medium text-boutique-cream transition-colors hover:bg-boutique-burgundy-dark"
              >
                התחברות
              </Link>
            )}

            <Link
              to="/cart"
              className="relative rounded-full p-2 transition-colors hover:bg-boutique-parchment"
            >
              <ShoppingCart size={22} className="text-boutique-ink" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-boutique-cream bg-boutique-burgundy font-sans text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-boutique-linen bg-boutique-parchment/50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="font-serif text-lg text-boutique-ink">WINE STORE</p>
          <p className="mt-2 font-sans text-xs text-boutique-muted">
            © 2026 Wine System — בוטיק יינות מובחרים
          </p>
        </div>
      </footer>
    </div>
  );
}