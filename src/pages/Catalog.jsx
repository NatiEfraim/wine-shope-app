import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { axiosInstance } from '../api/axios';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      // Filter only active products (is_active is not false and not deleted)
      const activeProducts = response.data.filter(product => product.is_active !== false && !product.is_deleted);
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-4 text-slate-500">טוען מוצרים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchProducts} className="mt-4">
          נסה שוב
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">יינות מובחרים</h2>
        <p className="text-slate-500 italic">בחרו את היין המושלם עבורכם מתוך הקולקציה שלנו</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4 bg-slate-50 p-6 rounded-lg text-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-16 object-contain" />
              ) : (
                "🍷"
              )}
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
              <div className="text-left">
                {product.discount > 0 ? (
                  <>
                    <span className="text-red-800 font-bold">₪{product.price_after_discount}</span>
                    <span className="text-sm text-slate-400 line-through ml-2">₪{product.price}</span>
                  </>
                ) : (
                  <span className="text-red-800 font-bold">₪{product.price}</span>
                )}
              </div>
            </div>
            {product.description && (
              <p className="text-sm text-slate-600 mb-2">{product.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className={`text-xs ${product.quantity < 10 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                מלאי זמין: {product.quantity}
              </span>
              <Button
                onClick={() => addToCart(product)}
                disabled={product.quantity === 0}
                className="text-sm"
              >
                <Plus size={16} /> הוסף לעגלה
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

