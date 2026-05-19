import React from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';

// Temporary mock data
const INITIAL_PRODUCTS = [
  { id: 1, name: "יין אדום יבש - קברנה", price: 120, stock: 45, category: "אדום", image: "🍷" },
  { id: 2, name: "יין לבן חצי יבש - שרדונה", price: 95, stock: 30, category: "לבן", image: "🥂" },
  { id: 3, name: "יין רוזה אביבי", price: 85, stock: 12, category: "רוזה", image: "🌸" },
  { id: 4, name: "מהדורה מוגבלת - מרלו", price: 250, stock: 5, category: "אדום", image: "💎" },
];


export default function Catalog() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">יינות מובחרים</h2>
        <p className="text-slate-500 italic">בחרו את היין המושלם עבורכם מתוך הקולקציה שלנו</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Button onClick={() => addToCart(product)} className="text-sm">
                <Plus size={16} /> הוסף לעגלה
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

