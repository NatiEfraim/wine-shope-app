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
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-800 text-white rounded-2xl mb-4 shadow-xl">
            <Wine size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">הרשמה למערכת</h1>
          <p className="text-slate-500 mt-2">הצטרפו אלינו והתחילו להזמין בקלות</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">שם מלא</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">תעודת זהות</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <CreditCard size={18} />
                </span>
                <input 
                  type="text" 
                  name="personal_id"
                  required
                  value={formData.personal_id}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">טלפון</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <Phone size={18} />
                </span>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">כתובת אימייל</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">סיסמה</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3 mt-4" disabled={isLoading}>
              {isLoading ? 'יוצר חשבון...' : (
                <><UserPlus size={20} /> צור חשבון חדש</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            כבר יש לכם חשבון?{' '}
            <Link to="/login" className="text-red-800 font-bold hover:underline">
              התחברו כאן
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}