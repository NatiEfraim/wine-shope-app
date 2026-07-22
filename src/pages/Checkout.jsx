import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Calendar, Hash, User, ShieldCheck, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Checkout() {
  const { cart, getTotalPrice, checkout } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    cardName: isAuthenticated ? user?.name || '' : '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    idNumber: isAuthenticated ? user?.personal_id || '' : '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const total = getTotalPrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.cardNumber.length < 15) {
      toast.error('מספר כרטיס אינו תקין');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('מעבד תשלום בטוח...');
    
    try {
    
      const guestData = isAuthenticated ? {} : {
        guest_name: formData.cardName,
        guest_email: formData.email || null,
        guest_phone: formData.phone,
        guest_personal_id: formData.idNumber
      };

      const success = await checkout(guestData);
      
      if (success) {
        toast.success('התשלום עבר בהצלחה!', { id: toastId });
        navigate('/checkout-success');
      } else {
        toast.error('אירעה שגיאה בביצוע ההזמנה', { id: toastId });
      }
    } catch (error) {
      toast.error('שגיאת שרת בתהליך הרכישה', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="animate-in fade-in duration-700 py-4 max-w-5xl mx-auto" dir="rtl">
      
      <header className="mb-8 text-right border-b border-boutique-linen pb-6">
        <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-700"/> Secure Checkout
        </p>
        <h2 className="font-serif text-4xl font-bold text-boutique-ink">תשלום בטוח</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
          <Card className="p-6 bg-boutique-parchment/30">
            <h3 className="font-serif text-2xl font-bold text-boutique-ink mb-6 border-b border-boutique-linen pb-4">
              סיכום ביניים
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => {
                const priceAfterDiscount = item.price_after_discount || item.price;
                return (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-3 border border-boutique-linen rounded-sm">
                    <div className="w-12 h-16 bg-boutique-parchment flex items-center justify-center border border-boutique-linen/50">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🍷</span>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-serif font-bold text-boutique-ink line-clamp-1">{item.name}</p>
                      <p className="text-xs text-boutique-muted">כמות: {item.qty}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-boutique-burgundy">₪{(priceAfterDiscount * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-boutique-linen">
              <div className="flex justify-between items-center mb-2">
                <span className="text-boutique-muted">משלוח:</span>
                <span className="text-emerald-700 font-medium text-sm">חינם</span>
              </div>
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-boutique-ink">לתשלום:</span>
                <span className="font-serif font-bold text-2xl text-boutique-burgundy">₪{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2">
          <Card className="relative p-8 shadow-gold-ring overflow-hidden">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-boutique-gold to-transparent" aria-hidden />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-boutique-charcoal p-2 rounded-full text-boutique-gold-light">
                <CreditCard size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-boutique-ink">פרטי תשלום</h3>
                <p className="text-xs text-boutique-muted mt-1 flex items-center gap-1">
                  <Lock size={10} /> תשלום מאובטח ומוצפן
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {}
              {!isAuthenticated && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-boutique-ink">אימייל (אופציונלי לקבלה)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><Mail size={18} strokeWidth={1.5} /></span>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-boutique-ink">טלפון</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><Phone size={18} strokeWidth={1.5} /></span>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                    </div>
                  </div>
                </div>
              )}

              <div className={!isAuthenticated ? "border-t border-boutique-linen pt-6" : ""}>
                <label className="mb-2 block text-sm font-semibold text-boutique-ink">מספר כרטיס</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><CreditCard size={18} strokeWidth={1.5} /></span>
                  <input type="text" name="cardNumber" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" value={formData.cardNumber} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/40 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-boutique-ink">תוקף (MM/YY)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><Calendar size={18} strokeWidth={1.5} /></span>
                    <input type="text" name="expiry" required placeholder="12/28" maxLength="5" value={formData.expiry} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/40 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-boutique-ink">CVV</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><Hash size={18} strokeWidth={1.5} /></span>
                    <input type="password" name="cvv" required placeholder="123" maxLength="4" value={formData.cvv} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/40 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-boutique-ink">שם בעל הכרטיס</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><User size={18} strokeWidth={1.5} /></span>
                    <input type="text" name="cardName" required placeholder="ישראל ישראלי" value={formData.cardName} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/40 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-boutique-ink">תעודת זהות</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-boutique-gold-muted"><User size={18} strokeWidth={1.5} /></span>
                    <input type="text" name="idNumber" required maxLength="9" value={formData.idNumber} onChange={handleInputChange} className="w-full border border-boutique-linen bg-white/70 py-3 pl-4 pr-11 text-right text-boutique-ink outline-none transition-all placeholder:text-boutique-muted/40 focus:border-boutique-gold focus:ring-2 focus:ring-boutique-gold/20" dir="ltr" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isProcessing} className="w-full py-4 text-lg shadow-[0_18px_35px_-18px_rgba(92,36,48,0.8)]">
                  {isProcessing ? 'מעבד תשלום...' : `שלם עכשיו ₪${total.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}