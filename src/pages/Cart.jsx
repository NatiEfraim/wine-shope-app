import React from 'react';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  // connect to the real global state store you created
  const { cart, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();

  // calculate the total payment based on real data
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert("הזמנה בוצעה בהצלחה! מייל אישור נשלח לכתובתך.");
    clearCart();
    navigate('/history');
  };

  // empty cart view
  if (cart.length === 0) return (
    <div className="animate-in fade-in border border-dashed border-boutique-gold/35 bg-boutique-cream py-20 text-center shadow-boutique" dir="rtl">
      <ShoppingCart size={64} className="mx-auto mb-4 text-boutique-gold/45" strokeWidth={1.25} />
      <h2 className="font-serif text-3xl font-semibold text-boutique-ink">העגלה שלך ריקה</h2>
      <p className="mb-6 mt-2 text-boutique-muted">נשמח לעזור לך למצוא את היין המושלם</p>
      <Link to="/">
        <Button variant="outline" className="mx-auto">
          <ArrowRight size={16} /> חזרה לקטלוג
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500" dir="rtl">
      <header className="mb-10 text-right">
        <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
          Checkout
        </p>
        <h2 className="font-serif text-4xl font-bold text-boutique-ink">עגלת הקניות שלך</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden border border-boutique-linen bg-boutique-parchment">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{item.image || '🍷'}</span>
                )}
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-serif text-xl font-semibold text-boutique-ink">{item.name}</h4>
                <p className="text-sm text-boutique-muted">₪{item.price} ליחידה</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQty(item.id, -1)} 
                  className="border border-boutique-linen p-1 text-boutique-muted transition-colors hover:border-boutique-gold hover:text-boutique-burgundy"
                >
                  <Minus size={18}/>
                </button>
                <span className="w-6 text-center font-bold text-boutique-ink">{item.qty}</span>
                <button 
                  onClick={() => updateQty(item.id, 1)} 
                  className="border border-boutique-linen p-1 text-boutique-muted transition-colors hover:border-boutique-gold hover:text-boutique-burgundy"
                >
                  <Plus size={18}/>
                </button>
              </div>
              <div className="text-left min-w-[80px]">
                <span className="font-serif text-xl font-bold text-boutique-burgundy">₪{item.price * item.qty}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* order summary */}
        <div className="space-y-4">
          <Card className="relative h-fit overflow-hidden p-6 shadow-gold-ring">
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-boutique-gold to-transparent"
              aria-hidden
            />
            <p className="mb-2 text-right font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
              Order Summary
            </p>
            <h3 className="mb-6 border-b border-boutique-linen pb-4 text-right font-serif text-2xl font-bold text-boutique-ink">
              סיכום הזמנה
            </h3>
            <div className="mb-6 space-y-4 text-right">
              <div className="flex justify-between text-boutique-muted">
                <span>סה"כ מוצרים:</span>
                <span className="font-medium text-boutique-ink">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
              </div>
              <div className="flex justify-between border-b border-boutique-linen pb-4 text-boutique-muted">
                <span>משלוח:</span>
                <span className="font-medium text-emerald-700">חינם</span>
              </div>
              <div className="flex justify-between pt-2 font-serif text-2xl font-bold">
                <span>סה"כ לתשלום:</span>
                <span className="text-boutique-burgundy">₪{total}</span>
              </div>
            </div>
            <Button onClick={handleCheckout} className="w-full py-4 text-lg shadow-[0_18px_35px_-18px_rgba(92,36,48,0.8)]">
              בצע הזמנה כעת
            </Button>
          </Card>
          <Link to="/" className="block text-center text-sm text-boutique-muted transition-colors hover:text-boutique-burgundy">
            המשך בקנייה
          </Link>
        </div>
      </div>
    </div>
  );
}