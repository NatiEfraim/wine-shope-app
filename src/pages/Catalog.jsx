import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { WineProductCard } from '../components/Card';
import Button from '../components/Button';
import WineCarousel from '../components/WineCarousel';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../api/axios';

export default function Catalog() {
  // API States
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-burgundy mx-auto"></div>
        <p className="mt-4 text-boutique-muted">טוען את הקולקציה שלנו...</p>
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
    <section className="animate-in fade-in duration-700">
      
      {/* Wine Carousel takes full width */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] -mt-12 mb-12 w-screen">
        <WineCarousel />
      </div>

      {/* Styled Header integrated with Admin Actions */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-boutique-linen/50 pb-6">
        <div className="text-right">
          <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
            הקולקציה שלנו
          </p>
          <h2 className="font-serif text-4xl font-bold text-boutique-ink md:text-5xl">
            יינות מובחרים
          </h2>
        </div>
        
        {/* Only Managers and Admins can see this button */}
        {isManagerOrAdmin && (
          <button 
            onClick={openAddModal} 
            className="flex items-center justify-center gap-2 rounded bg-boutique-charcoal px-6 py-2.5 font-sans text-sm font-medium text-boutique-cream transition-all hover:bg-boutique-ink"
          >
            <PlusCircle size={18} /> 
            הוסף מוצר חדש
          </button>
        )}
      </header>

      {/* Main Grid mapping dynamic API products to Meni's card */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <WineProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            isAdmin={isManagerOrAdmin}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add/Edit Product Modal (Unchanged logical structure, slightly refined colors) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-boutique-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-boutique-cream rounded-sm border border-boutique-gold/20 shadow-2xl w-full max-w-md overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center p-4 border-b border-boutique-linen">
              <h3 className="font-serif text-xl font-bold text-boutique-ink">
                {editingProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-boutique-muted hover:text-boutique-burgundy transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-boutique-ink mb-1">שם המוצר</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-boutique-linen rounded bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-boutique-ink mb-1">מחיר מקורי (₪)</label>
                  <input 
                    type="number" step="0.01" name="price" required value={formData.price} onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-boutique-linen rounded bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-boutique-ink mb-1">הנחה (₪)</label>
                  <input 
                    type="number" step="0.01" name="discount" value={formData.discount} onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-boutique-linen rounded bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-boutique-ink mb-1">כמות במלאי</label>
                <input 
                  type="number" name="quantity" required value={formData.quantity} onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-boutique-linen rounded bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-boutique-ink mb-1">תיאור</label>
                <textarea 
                  name="description" rows="3" value={formData.description} onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-boutique-linen rounded bg-white focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold outline-none resize-none transition-all"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1 bg-boutique-burgundy hover:bg-boutique-burgundy-dark text-white border-none">
                  {editingProduct ? 'שמור שינויים' : 'צור מוצר'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 border-boutique-linen hover:bg-boutique-linen/30">
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}