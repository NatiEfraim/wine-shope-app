import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const { cart, updateQty, clearCart, getTotalPrice, getTotalItems, checkout } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const total = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      const success = await checkout();
      if (success) {
        alert("הזמנה בוצעה בהצלחה! מייל אישור נשלח לכתובתך.");
        navigate('/history');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // empty cart view
  if (cart.length === 0) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed animate-in fade-in" dir="rtl">
      <ShoppingCart size={64} className="mx-auto text-slate-200 mb-4" />
      <h2 className="text-xl font-medium text-slate-600">העגלה שלך ריקה</h2>
      <p className="text-slate-400 mb-6">נשמח לעזור לך למצוא את היין המושלם</p>
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
        <h2 className="text-3xl font-black text-slate-800 mb-2">עגלת הקניות שלך</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const priceAfterDiscount = item.price_after_discount || item.price;
            return (
              <Card key={item.id} className="flex items-center gap-4">
                <span className="text-3xl bg-slate-50 p-3 rounded-lg">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                  ) : (
                    "🍷"
                  )}
                </span>
                <div className="flex-1 text-right">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-slate-500">₪{priceAfterDiscount} ליחידה</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Minus size={18}/>
                  </button>
                  <span className="font-bold w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Plus size={18}/>
                  </button>
                </div>
                <div className="text-left min-w-[80px]">
                  <span className="font-bold">₪{(priceAfterDiscount * item.qty).toFixed(2)}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* order summary */}
        <div className="space-y-4">
          <Card className="h-fit">
            <h3 className="text-xl font-bold mb-6 border-b pb-4 text-right">סיכום הזמנה</h3>
            <div className="space-y-3 mb-6 text-right">
              <div className="flex justify-between text-slate-600">
                <span>סה"כ מוצרים:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-slate-600 border-b pb-3">
                <span>משלוח:</span>
                <span className="text-emerald-600 font-medium">חינם</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3">
                <span>סה"כ לתשלום:</span>
                <span className="text-red-800">₪{total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 text-lg"
            >
              {isCheckingOut ? 'מעבד הזמנה...' : 'בצע הזמנה כעת'}
            </Button>
          </Card>
          <Link to="/" className="block text-center text-sm text-slate-400 hover:text-red-800 transition-colors">
            המשך בקנייה
          </Link>
        </div>
      </div>
    </div>
  );
}