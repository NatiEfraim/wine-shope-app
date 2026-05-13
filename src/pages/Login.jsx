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
    
    // call the store function that talks to the server
    const success = await login(email, password);
    
    if (success) {
      navigate('/'); // if successful, go back to the catalog
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-800 text-white rounded-2xl mb-4 shadow-xl">
            <Wine size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800">WINE STORE</h1>
          <p className="text-slate-500 mt-2">ברוכים השבים! התחברו כדי להמשיך</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">כתובת אימייל</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-right"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? 'מתחבר לשרת...' : (
                <><LogIn size={20} /> התחברות</>
              )}
            </Button>
         </form>

          {/* Add this section right after the form closes */}
          <div className="mt-6 text-center text-sm text-slate-500">
            עדיין אין לכם חשבון?{' '}
            <Link to="/register" className="text-red-800 font-bold hover:underline">
              הירשמו עכשיו
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
