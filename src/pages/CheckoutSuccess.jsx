import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, CheckCircle, PackageOpen, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function CheckoutSuccess() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-10" dir="rtl">
      
      {/* Radial boutique background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,169,98,0.15),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(92,36,48,0.12),transparent_30%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-lg z-10 animate-in zoom-in-95 duration-700">
        <Card className="relative overflow-hidden p-10 shadow-gold-ring text-center bg-white/95 backdrop-blur-sm">
          <div
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-boutique-gold to-transparent"
            aria-hidden
          />
          
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-50 text-emerald-600 shadow-sm relative">
            <CheckCircle size={40} strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 bg-boutique-charcoal rounded-full p-1.5 border-2 border-white text-boutique-gold-light">
              <Wine size={14} />
            </div>
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-boutique-ink mb-3">
            הזמנתך התקבלה!
          </h1>
          
          <p className="font-sans text-sm text-boutique-muted mb-8 leading-relaxed">
            תודה שבחרת בבוטיק היינות שלנו. התשלום בוצע בהצלחה ופרטי ההזמנה הועברו לטיפול. <br/>
            אישור הזמנה וחשבונית מס נשלחו לכתובת המייל שלך.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/history" className="w-full sm:w-auto">
              <Button className="w-full flex items-center justify-center gap-2">
                <PackageOpen size={16} /> מעקב הזמנות
              </Button>
            </Link>
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <ArrowRight size={16} /> חזרה לקטלוג
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}