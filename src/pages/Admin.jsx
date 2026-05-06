import React from 'react';
import { Truck, FileSpreadsheet, Settings, Mail, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const INITIAL_ORDERS = [
  { id: 'ORD-5521', date: '2024-03-15', total: 215, status: 'בטיפול', items: 2 },
  { id: 'ORD-5490', date: '2024-02-10', total: 450, status: 'נשלח', items: 4 },
];

export default function Admin() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">לוח בקרה - מנהל מערכת</h2>
        <p className="text-slate-500 italic">ניהול מלאי, סטטוסים ודוחות מערכת</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-800 to-red-950 text-white">
          <p className="opacity-80 text-sm">סה"כ הזמנות (חודשי)</p>
          <h2 className="text-3xl font-bold">142</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">הכנסות החודש</p>
          <h2 className="text-3xl font-bold">₪42,300</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">מוצרים במלאי נמוך</p>
          <h2 className="text-3xl font-bold text-red-600">3</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">לקוחות רשומים</p>
          <h2 className="text-3xl font-bold">892</h2>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Truck size={20}/> ניהול הזמנות אחרונות
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" className="text-xs">
              <FileSpreadsheet size={16}/> ייצוא XLSX (S3)
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b text-slate-400 text-sm">
                <th className="pb-3 pr-2">מזהה הזמנה</th>
                <th className="pb-3">לקוח</th>
                <th className="pb-3">סטטוס</th>
                <th className="pb-3">סכום</th>
                <th className="pb-3">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {INITIAL_ORDERS.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium">{order.id}</td>
                  <td>ישראל ישראלי</td>
                  <td><Badge status={order.status}/></td>
                  <td className="font-bold">₪{order.total}</td>
                  <td>
                    <select className="bg-slate-100 border-none text-xs rounded p-1">
                      <option>עדכן סטטוס</option>
                      <option>נשלח</option>
                      <option>הושלם</option>
                      <option>בוטל</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
