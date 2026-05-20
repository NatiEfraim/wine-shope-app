import React, { useState } from 'react';
import { Mail, Lock, LogIn, Wine } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the store function that talks to the server
    const success = await login(email, password);
    
    if (success) {
      navigate('/'); // If successful, go back to the catalog
    }
  };

  return (
    <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden py-10" dir="rtl">
      {/* Meni's elegant background design */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,169,98,0.22),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(92,36,48,0.16),transparent_30%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-boutique-gold/40 bg-boutique-charcoal text-boutique-gold-light shadow-gold-ring">
            <Wine size={32} strokeWidth={1.5} />
          </div>
          <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
            Boutique Members
          </p>
          <h1 className="font-serif text-4xl font-bold text-boutique-ink">
            WINE STORE
          </h1>
          <p className="mt-2 font-sans text-sm text-boutique-muted">
            ברוכים השבים! התחברו כדי להמשיך אל קולקציית הבוטיק
          </p>
        </div>

        <Card className="relative overflow-hidden p-8 shadow-gold-ring">
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-boutique-gold to-transparent"
            aria-hidden
          />
          
          {error && (
            <div className="mb-6 border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-boutique-ink">
                כתובת אימייל
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-boutique-ink">
                סיסמה
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                  dir="ltr"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-base shadow-[0_18px_35px_-18px_rgba(92,36,48,0.8)]"
              disabled={isLoading}
            >
              {isLoading ? 'מתחבר לשרת...' : (
                <><LogIn size={20} /> התחברות</>
              )}
            </Button>
          </form>

          {/* Restored the missing link to the register page */}
          <div className="mt-6 text-center text-sm text-boutique-muted">
            עדיין אין לכם חשבון?{' '}
            <Link to="/register" className="font-bold text-boutique-burgundy hover:text-boutique-burgundy-dark hover:underline transition-colors">
              הירשמו עכשיו
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}