import React from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const INITIAL_ORDERS = [
  { id: 'ORD-5521', date: '2024-03-15', total: 215, status: 'בטיפול', items: 2 },
  { id: 'ORD-5490', date: '2024-02-10', total: 450, status: 'נשלח', items: 4 },
];

export default function History() {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">מעקב הזמנות</h2>
      </header>

      <div className="space-y-4 max-w-3xl mx-auto">
        {INITIAL_ORDERS.map(order => (
          <Card key={order.id} className="flex justify-between items-center p-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg">הזמנה #{order.id}</span>
                <Badge status={order.status} />
              </div>
              <p className="text-sm text-slate-400">בוצעה בתאריך: {order.date} • {order.items} פריטים</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-xl mb-2">₪{order.total}</p>
              <Button variant="outline" className="text-xs">פרטי הזמנה</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
