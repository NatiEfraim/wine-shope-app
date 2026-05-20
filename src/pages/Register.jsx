import React, { useState } from 'react';
import { Mail, Lock, Wine, User, CreditCard, Phone, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    personal_id: '',
    phone: '',
    email: '',
    password: ''
  });
  
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call the register function from store
    const success = await register(formData);
    
    if (success) {
      // If successful, the store automatically logs in the user, redirect to catalog
      navigate('/'); 
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-10" dir="rtl">
      {/* Meni's elegant background design applied to Register */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,169,98,0.22),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(92,36,48,0.16),transparent_30%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-md z-10">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-boutique-gold/40 bg-boutique-charcoal text-boutique-gold-light shadow-gold-ring">
            <Wine size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-boutique-ink">
            הרשמה למערכת
          </h1>
          <p className="mt-2 font-sans text-sm text-boutique-muted">
            הצטרפו אלינו והתחילו להזמין בקלות מקולקציית הבוטיק
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-boutique-ink">
                שם מלא
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <User size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-boutique-linen bg-white/70 py-2.5 pl-4 pr-11 text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-boutique-ink">
                תעודת זהות
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <CreditCard size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="text" 
                  name="personal_id"
                  required
                  value={formData.personal_id}
                  onChange={handleChange}
                  className="w-full border border-boutique-linen bg-white/70 py-2.5 pl-4 pr-11 text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-boutique-ink">
                טלפון
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <Phone size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-boutique-linen bg-white/70 py-2.5 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-boutique-ink">
                כתובת אימייל
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-boutique-linen bg-white/70 py-2.5 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-boutique-ink">
                סיסמה
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-boutique-linen bg-white/70 py-2.5 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/60 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20"
                  dir="ltr"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3.5 mt-2 shadow-[0_18px_35px_-18px_rgba(92,36,48,0.8)]" 
              disabled={isLoading}
            >
              {isLoading ? 'יוצר חשבון...' : (
                <><UserPlus size={20} /> צור חשבון חדש</>
              )}
            </Button>
          </form>

          {/* Styled link to login page */}
          <div className="mt-6 text-center text-sm text-boutique-muted">
            כבר יש לכם חשבון?{' '}
            <Link to="/login" className="font-bold text-boutique-burgundy hover:text-boutique-burgundy-dark hover:underline transition-colors">
              התחברו כאן
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}