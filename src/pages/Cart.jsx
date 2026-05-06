import React from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Cart({ cart, onUpdateQty, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  if (cart.length === 0) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
      <ShoppingCart size={64} className="mx-auto text-slate-200 mb-4" />
      <h2 className="text-xl font-medium text-slate-600">העגלה שלך ריקה</h2>
      <p className="text-slate-400 mb-6">נשמח לעזור לך למצוא את היין המושלם</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">עגלת הקניות שלך</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="flex items-center gap-4">
              <span className="text-3xl bg-slate-50 p-3 rounded-lg">{item.image}</span>
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-sm text-slate-500">₪{item.price} ליחידה</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:bg-slate-100 rounded"><Minus size={18}/></button>
                <span className="font-bold w-6 text-center">{item.qty}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:bg-slate-100 rounded"><Plus size={18}/></button>
              </div>
              <div className="text-left min-w-[80px]">
                <span className="font-bold">₪{item.price * item.qty}</span>
              </div>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <h3 className="text-xl font-bold mb-6 border-b pb-4">סיכום הזמנה</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>סה"כ מוצרים:</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-b pb-3">
              <span>משלוח:</span>
              <span className="text-emerald-600 font-medium">חינם</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-3">
              <span>סה"כ לתשלום:</span>
              <span className="text-red-800">₪{total}</span>
            </div>
          </div>
          <Button onClick={onCheckout} className="w-full py-4 text-lg">בצע הזמנה כעת</Button>
        </Card>
      </div>
    </div>
  );
}
