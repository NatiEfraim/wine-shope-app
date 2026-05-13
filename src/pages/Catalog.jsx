import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, PlusCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../api/axios';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    discount: 0
  });

  const addToCart = useCartStore((state) => state.addToCart);
  
  // Get user and check permissions
  const { user } = useAuthStore();
  const isManagerOrAdmin = user?.role?.some(r => r.id === 1 || r.id === 2);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      
      // Handle Laravel's possible wrapper ({ data: [...] } or just [...])
      const productsData = response.data.data || response.data || [];
      
      // Filter active products
      const activeProducts = productsData.filter(product => product.is_active !== false && !product.is_deleted);
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Admin/Manager ---

  const handleDelete = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) return;
    
    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchProducts(); // Refresh list after deletion
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('שגיאה במחיקת המוצר');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', quantity: '', discount: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      quantity: product.quantity || '',
      discount: product.discount || 0
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        await axiosInstance.put(`/products/${editingProduct.id}`, formData);
      } else {
        // Create new product
        await axiosInstance.post('/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Error saving product:', err);
      alert('שגיאה בשמירת המוצר. ודא שכל השדות מלאים כראוי.');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Render Functions ---

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
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">יינות מובחרים</h2>
          <p className="text-slate-500 italic">בחרו את היין המושלם עבורכם מתוך הקולקציה שלנו</p>
        </div>
        
        {/* Only Managers and Admins can see this button */}
        {isManagerOrAdmin && (
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <PlusCircle size={18} /> הוסף מוצר חדש
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
            
            {/* Admin Controls overlay */}
            {isManagerOrAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button 
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-white/90 shadow rounded-md text-slate-600 hover:text-blue-600 transition-colors"
                  title="ערוך מוצר"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 shadow rounded-md text-slate-600 hover:text-red-600 transition-colors"
                  title="מחק מוצר"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div className="text-5xl mb-4 bg-slate-50 p-6 rounded-lg text-center mt-4">
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
                    <span className="text-red-800 font-bold">₪{product.price_after_discount || (product.price - product.discount)}</span>
                    <span className="text-sm text-slate-400 line-through ml-2">₪{product.price}</span>
                  </>
                ) : (
                  <span className="text-red-800 font-bold">₪{product.price}</span>
                )}
              </div>
            </div>
            
            {product.description && (
              <p className="text-sm text-slate-600 mb-2 truncate">{product.description}</p>
            )}
            
            <div className="flex items-center justify-between mt-4">
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">
                {editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">שם המוצר</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">מחיר מקורי (₪)</label>
                  <input 
                    type="number" step="0.01" name="price" required value={formData.price} onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">הנחה (₪)</label>
                  <input 
                    type="number" step="0.01" name="discount" value={formData.discount} onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">כמות במלאי</label>
                <input 
                  type="number" name="quantity" required value={formData.quantity} onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">תיאור</label>
                <textarea 
                  name="description" rows="3" value={formData.description} onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-800 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-2">
                <Button type="submit" className="w-full">
                  {editingProduct ? 'שמור שינויים' : 'צור מוצר'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="w-full">
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}