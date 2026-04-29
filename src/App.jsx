import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  Settings, 
  Package, 
  ChevronRight, 
  ShoppingCart, 
  LogOut, 
  Menu, 
  X,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
  Mail,
  FileSpreadsheet,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';

/**
 * first data mockup
 * will be replaced with API calls
 */
const INITIAL_PRODUCTS = [
  { id: 1, name: "יין אדום יבש - קברנה", price: 120, stock: 45, category: "אדום", image: "🍷" },
  { id: 2, name: "יין לבן חצי יבש - שרדונה", price: 95, stock: 30, category: "לבן", image: "🥂" },
  { id: 3, name: "יין רוזה אביבי", price: 85, stock: 12, category: "רוזה", image: "🌸" },
  { id: 4, name: "מהדורה מוגבלת - מרלו", price: 250, stock: 5, category: "אדום", image: "💎" },
];

const INITIAL_ORDERS = [
  { id: 'ORD-5521', date: '2024-03-15', total: 215, status: 'בטיפול', items: 2 },
  { id: 'ORD-5490', date: '2024-02-10', total: 450, status: 'נשלח', items: 4 },
];

// ---UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-800 text-white hover:bg-red-900 shadow-md",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-red-800 text-red-800 hover:bg-red-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    'בטיפול': 'bg-amber-100 text-amber-700',
    'נשלח': 'bg-blue-100 text-blue-700',
    'הושלם': 'bg-emerald-100 text-emerald-700',
    'בוטל': 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
};

// --- Pages ---

const CatalogPage = ({ onAddToCart }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
    {INITIAL_PRODUCTS.map(product => (
      <Card key={product.id} className="hover:shadow-md transition-shadow">
        <div className="text-5xl mb-4 bg-slate-50 p-6 rounded-lg text-center">{product.image}</div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
          <span className="text-red-800 font-bold">₪{product.price}</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">קטגוריה: {product.category}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${product.stock < 10 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            מלאי זמין: {product.stock}
          </span>
          <Button onClick={() => onAddToCart(product)} className="text-sm">
            <Plus size={16} /> הוסף לעגלה
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const CartPage = ({ cart, onUpdateQty, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  if (cart.length === 0) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
      <ShoppingCart size={64} className="mx-auto text-slate-200 mb-4" />
      <h2 className="text-xl font-medium text-slate-600">העגלה שלך ריקה</h2>
      <p className="text-slate-400 mb-6">נשמח לעזור לך למצוא את היין המושלם</p>
    </div>
  );

  return (
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
  );
};

const AdminDashboard = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4">
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
            <FileSpreadsheet size={16}/> ייצוא XLSX (3S)
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18}/> לוג פעולות עורכים</h3>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="text-xs flex items-start gap-3 border-r-2 border-red-100 pr-3">
              <span className="text-slate-400">12:30</span>
              <p>עורך <strong>מוטי</strong> עדכן מלאי למוצר "קברנה" (-5)</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-bold mb-4 flex items-center gap-2"><Mail size={18}/> לוג שליחת מיילים</h3>
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="text-xs flex items-center justify-between p-2 bg-slate-50 rounded">
              <span>אישור הזמנה נשלח ללקוח #4412</span>
              <CheckCircle size={14} className="text-emerald-500" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState('customer'); // customer, admin, editor
  const [showNotification, setShowNotification] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerNotification();
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }).filter(p => p.qty > 0));
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCheckout = () => {
    // Flow: 1. Customer places order -> 2. Update inventory -> 3. Send email
    alert("הזמנה בוצעה בהצלחה! מייל אישור נשלח לכתובתך.");
    setCart([]);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Notification message */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={20}/> המוצר נוסף לעגלה בהצלחה!
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-red-900 flex items-center gap-2">
              <Package size={28}/> WINE STORE
            </h1>
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => setActiveTab('catalog')} 
                className={`transition-colors font-medium ${activeTab === 'catalog' ? 'text-red-800' : 'text-slate-500 hover:text-slate-800'}`}
              >
                חנות
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                className={`transition-colors font-medium ${activeTab === 'history' ? 'text-red-800' : 'text-slate-500 hover:text-slate-800'}`}
              >
                הזמנות שלי
              </button>
              {(userRole === 'admin' || userRole === 'editor') && (
                <button 
                  onClick={() => setActiveTab('admin')} 
                  className={`transition-colors font-medium flex items-center gap-1 ${activeTab === 'admin' ? 'text-red-800' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ממשק ניהול <Settings size={14}/>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button onClick={() => setUserRole('customer')} className={`px-2 py-1 rounded ${userRole === 'customer' ? 'bg-white shadow-sm' : ''}`}>לקוח</button>
              <button onClick={() => setUserRole('admin')} className={`px-2 py-1 rounded ${userRole === 'admin' ? 'bg-white shadow-sm' : ''}`}>אדמין</button>
            </div>
            
            <button onClick={() => setActiveTab('cart')} className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <div className="h-8 w-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center font-bold">
              ע
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {activeTab === 'catalog' && "יינות מובחרים"}
            {activeTab === 'cart' && "עגלת הקניות שלך"}
            {activeTab === 'history' && "מעקב הזמנות"}
            {activeTab === 'admin' && "לוח בקרה - מנהל מערכת"}
          </h2>
          <p className="text-slate-500 italic">
            {activeTab === 'catalog' && "בחרו את היין המושלם עבורכם מתוך הקולקציה שלנו"}
            {activeTab === 'admin' && "ניהול מלאי, סטטוסים ודוחות מערכת"}
          </p>
        </header>

        {/* Page Routing */}
        {activeTab === 'catalog' && <CatalogPage onAddToCart={addToCart} />}
        {activeTab === 'cart' && <CartPage cart={cart} onUpdateQty={updateQty} onCheckout={handleCheckout} />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'history' && (
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
        )}
      </main>

      {/* Simple Footer */}
      <footer className="mt-20 border-t py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 Wine System - פרויקט גמר FSD</p>
          <div className="flex justify-center gap-4 mt-4">
            <span>נתנאל אפרים</span>
            <span>•</span>
            <span>מרדכי פקטר</span>
            <span>•</span>
            <span>מנחם מנדל בויגל</span>
          </div>
        </div>
      </footer>
    </div>
  );
}