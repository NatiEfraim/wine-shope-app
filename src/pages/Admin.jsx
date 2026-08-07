import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Settings, Mail, CheckCircle, Eye, X, Wine, MapPin, CreditCard, User, Users, Package, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import DashboardCharts from '../components/DashboardCharts';
import { axiosInstance } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

const statusOptions = [
  { id: 1, name: 'pending', label: 'ממתין לאישור' },
  { id: 2, name: 'approved', label: 'אושר' },
  { id: 3, name: 'delivered', label: 'נשלח' },
  { id: 4, name: 'completed', label: 'הושלם' },
];

const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  return [];
};

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isSuperAdmin = user?.role?.some(r => r.id === 1);

  const stats = useMemo(() => ({
    totalOrders: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0),
    lowStockProducts,
    totalUsers,
  }), [bookings, lowStockProducts, totalUsers]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bookingsRes, productsRes, usersRes] = await Promise.allSettled([
        axiosInstance.get('/bookings'),
        axiosInstance.get('/products'),
        axiosInstance.get('/users'),
      ]);

      if (bookingsRes.status === 'fulfilled') {
        setBookings(extractArray(bookingsRes.value.data));
      }

      if (productsRes.status === 'fulfilled') {
        const productsData = extractArray(productsRes.value.data);
        setProducts(productsData);
        setLowStockProducts(productsData.filter(p => p.quantity < 10).length);
      }

      if (usersRes.status === 'fulfilled') {
        setTotalUsers(extractArray(usersRes.value.data).length);
      }
    } catch (error) {
      console.error('Error loading dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateBookingStatus = async (bookingId, newStatusId) => {
    const snapshot = [...bookings];
    const newStatusName = statusOptions.find(s => s.id === newStatusId)?.name;

    setBookings(prev => prev.map(b =>
      b.id === bookingId
        ? { ...b, status_id: newStatusId, status: { ...(b.status || {}), name: newStatusName || b.status?.name } }
        : b
    ));
    setUpdatingStatus(bookingId);

    try {
      await axiosInstance.put(`/bookings/${bookingId}`, { status_id: newStatusId });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון סטטוס ההזמנה');
      setBookings(snapshot);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 200);
  };

  const openProductEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      discount: product.discount || 0,
      quantity: product.quantity || 0,
      description: product.description || ''
    });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setEditingProduct(null), 200);
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/products/${editingProduct.id}`, editingProduct);
      closeProductModal();
      loadAll(); 
    } catch (error) {
      console.error('Error updating product:', error);
      alert('שגיאה בעדכון המוצר. ודא שכל השדות תקינים.');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המוצר "${productName}" לצמיתות?`)) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        loadAll();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('שגיאה במחיקת המוצר');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-burgundy mx-auto"></div>
        <p className="mt-4 text-boutique-muted">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative" dir="rtl">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-boutique-linen pb-6">
        <div>
          <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
            Management Dashboard
          </p>
          <h2 className="font-serif text-4xl font-bold text-boutique-ink mb-2">
            לוח בקרה
          </h2>
          <p className="text-boutique-muted font-sans text-sm">מעקב אחר פעילות החנות, הזמנות ומלאי</p>
        </div>
        
        {isSuperAdmin && (
          <Button onClick={() => navigate('/admin/users')} className="flex items-center gap-2">
            <Users size={18} /> ניהול משתמשים והרשאות
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-boutique-muted text-sm font-sans mb-1">סה"כ הזמנות</p>
          <h2 className="text-4xl font-serif font-bold text-boutique-ink">{stats.totalOrders}</h2>
        </Card>
        <Card className="p-6">
          <p className="text-boutique-muted text-sm font-sans mb-1">הכנסות מצטברות</p>
          <h2 className="text-4xl font-serif font-bold text-boutique-burgundy">₪{stats.totalRevenue.toFixed(2)}</h2>
        </Card>
        <Card className="p-6">
          <p className="text-boutique-muted text-sm font-sans mb-1">מוצרים במלאי נמוך</p>
          <h2 className="text-4xl font-serif font-bold text-red-700">{stats.lowStockProducts}</h2>
        </Card>
        <Card className="p-6">
          <p className="text-boutique-muted text-sm font-sans mb-1">לקוחות רשומים</p>
          <h2 className="text-4xl font-serif font-bold text-boutique-ink">{stats.totalUsers}</h2>
        </Card>
      </div>

      <DashboardCharts bookings={bookings} />

      <Card className="overflow-hidden shadow-boutique mt-8">
        <div className="flex justify-between items-center p-6 border-b border-boutique-linen bg-boutique-parchment/50">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2 text-boutique-ink">
            <Truck size={22} className="text-boutique-gold-muted" /> ניהול הזמנות
          </h3>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-right font-sans relative">
            <thead className="bg-boutique-cream sticky top-0 z-10">
              <tr className="text-boutique-muted text-sm border-b border-boutique-linen">
                <th className="py-4 pr-6 font-medium">מזהה הזמנה</th>
                <th className="py-4 font-medium">לקוח</th>
                <th className="py-4 font-medium">סטטוס</th>
                <th className="py-4 font-medium">סכום</th>
                <th className="py-4 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-boutique-linen bg-white">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-boutique-parchment/40 transition-colors group">
                  <td className="py-4 pr-6 font-semibold text-boutique-ink">#{booking.serial_number}</td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-boutique-ink">{booking.user?.name}</span>
                      <span className="text-xs text-boutique-muted">{booking.user?.email}</span>
                    </div>
                  </td>
                  <td className="py-4"><Badge status={booking.status?.name || 'לא ידוע'} /></td>
                  <td className="py-4 font-serif font-bold text-lg text-boutique-burgundy">₪{parseFloat(booking.total_price).toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <select
                        className="bg-white border border-boutique-linen text-xs rounded-sm p-2 focus:ring-1 focus:ring-boutique-gold focus:border-boutique-gold outline-none text-boutique-ink"
                        disabled={updatingStatus === booking.id}
                        value={booking.status_id || ''}
                        onChange={(e) => updateBookingStatus(booking.id, parseInt(e.target.value))}
                      >
                        {statusOptions.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => openBookingDetails(booking)}
                        className="p-1.5 text-boutique-muted hover:text-boutique-burgundy hover:bg-boutique-parchment rounded transition-all"
                        title="צפה בפרטים"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-boutique mt-8">
        <div className="flex justify-between items-center p-6 border-b border-boutique-linen bg-boutique-parchment/50">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2 text-boutique-ink">
            <Package size={22} className="text-boutique-gold-muted" /> ניהול קטלוג ומלאי
          </h3>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-right font-sans relative">
            <thead className="bg-boutique-cream sticky top-0 z-10">
              <tr className="text-boutique-muted text-sm border-b border-boutique-linen">
                <th className="py-4 pr-6 font-medium">מוצר</th>
                <th className="py-4 font-medium">מק"ט</th>
                <th className="py-4 font-medium">מלאי</th>
                <th className="py-4 font-medium">מחיר רגיל</th>
                <th className="py-4 font-medium">הנחה</th>
                <th className="py-4 font-medium">מחיר סופי</th>
                <th className="py-4 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-boutique-linen bg-white">
              {products.map(product => {
                const finalPrice = product.price_after_discount || product.price;
                const isLowStock = product.quantity < 10;
                
                return (
                  <tr key={product.id} className="hover:bg-boutique-parchment/40 transition-colors">
                    <td className="py-3 pr-6 font-semibold text-boutique-ink max-w-[200px] truncate" title={product.name}>
                      {product.name}
                    </td>
                    <td className="py-3 text-sm text-boutique-muted">{product.sku}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-sm text-xs font-bold ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-3 text-sm">₪{parseFloat(product.price).toFixed(2)}</td>
                    <td className="py-3 text-sm text-boutique-burgundy">{product.discount ? `${parseFloat(product.discount).toFixed(2)}%` : '-'}</td>
                    <td className="py-3 font-bold text-boutique-ink">₪{parseFloat(finalPrice).toFixed(2)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openProductEdit(product)}
                          className="flex items-center gap-1 text-xs text-boutique-gold-muted hover:text-boutique-burgundy transition-colors bg-boutique-cream px-2 py-1.5 rounded-sm border border-boutique-linen hover:border-boutique-burgundy/30"
                        >
                          <Edit2 size={14} /> עדכן
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors bg-red-50 px-2 py-1.5 rounded-sm border border-red-100 hover:border-red-300"
                        >
                          <Trash2 size={14} /> מחק
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-boutique-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-sm shadow-2xl border border-boutique-gold/20 w-full max-w-md flex flex-col overflow-hidden" dir="rtl">
            <div className="flex justify-between items-center p-5 border-b border-boutique-linen bg-boutique-cream">
              <h3 className="font-serif font-bold text-xl text-boutique-ink truncate pr-2">עריכת מוצר</h3>
              <button onClick={closeProductModal} className="p-1 text-boutique-muted hover:text-boutique-burgundy transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-boutique-ink mb-1">שם מוצר</label>
                <input 
                  type="text" required 
                  value={editingProduct.name} 
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full border border-boutique-linen bg-white py-2 px-3 text-boutique-ink outline-none focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-boutique-ink mb-1">כמות במלאי</label>
                  <input 
                    type="number" min="0" required 
                    value={editingProduct.quantity} 
                    onChange={e => setEditingProduct({...editingProduct, quantity: e.target.value})}
                    className="w-full border border-boutique-linen bg-white py-2 px-3 text-boutique-ink outline-none focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-boutique-ink mb-1">מחיר מקורי (₪)</label>
                  <input 
                    type="number" min="0" step="0.01" required 
                    value={editingProduct.price} 
                    onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full border border-boutique-linen bg-white py-2 px-3 text-boutique-ink outline-none focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-boutique-ink mb-1">הנחה (%)</label>
                <input 
                  type="number" min="0" max="100" step="0.01" 
                  value={editingProduct.discount} 
                  onChange={e => setEditingProduct({...editingProduct, discount: e.target.value})}
                  className="w-full border border-boutique-linen bg-white py-2 px-3 text-boutique-ink outline-none focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-boutique-ink mb-1">תיאור מוצר</label>
                <textarea 
                  rows="3"
                  value={editingProduct.description} 
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full border border-boutique-linen bg-white py-2 px-3 text-boutique-ink outline-none focus:border-boutique-gold focus:ring-1 focus:ring-boutique-gold transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3 border-t border-boutique-linen mt-6">
                <Button type="submit" className="flex-1">שמור שינויים</Button>
                <Button type="button" variant="secondary" onClick={closeProductModal} className="flex-1">ביטול</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-boutique-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-boutique-cream rounded-sm shadow-2xl border border-boutique-gold/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300" dir="rtl">
            
            <div className="flex justify-between items-center p-6 border-b border-boutique-linen bg-white">
              <div>
                <h3 className="font-serif font-bold text-2xl text-boutique-ink">פרטי הזמנה #{selectedBooking.serial_number}</h3>
                <p className="text-sm text-boutique-muted mt-1 font-sans">{new Date(selectedBooking.created_at).toLocaleString('he-IL')}</p>
              </div>
              <button onClick={closeDetailsModal} className="p-2 bg-boutique-parchment rounded-full text-boutique-muted hover:text-boutique-burgundy transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              
              <div className="bg-white p-5 rounded-sm border border-boutique-linen mb-6 flex items-start gap-4 shadow-sm">
                <div className="bg-boutique-burgundy text-boutique-cream p-3 rounded-full shrink-0"><User size={20}/></div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 w-full">
                  <div>
                    <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury">שם הלקוח</p>
                    <p className="font-semibold text-boutique-ink">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury">ת.ז.</p>
                    <p className="font-semibold text-boutique-ink">{selectedBooking.user?.personal_id || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury">אימייל</p>
                    <p className="text-sm text-boutique-ink">{selectedBooking.user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury">טלפון</p>
                    <p className="text-sm text-boutique-ink">{selectedBooking.user?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white p-5 rounded-sm border border-boutique-linen flex items-start gap-3 shadow-sm">
                    <MapPin className="text-boutique-gold-muted mt-1" size={20} />
                    <div>
                      <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury mb-1">סטטוס נוכחי</p>
                      <div><Badge status={selectedBooking.status?.name} /></div>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-sm border border-boutique-linen flex items-start gap-3 shadow-sm">
                    <CreditCard className="text-boutique-gold-muted mt-1" size={20} />
                    <div>
                      <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury mb-1">סה"כ הזמנה</p>
                      <p className="font-serif font-bold text-2xl text-boutique-burgundy">₪{parseFloat(selectedBooking.total_price).toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              <h4 className="font-serif font-bold text-boutique-ink mb-4 text-xl border-b border-boutique-linen pb-2">רשימת יינות בהזמנה</h4>
              <div className="space-y-3">
                {selectedBooking.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white border border-boutique-linen rounded-sm">
                    <div className="w-16 h-20 bg-boutique-parchment flex items-center justify-center shrink-0 border border-boutique-linen/50 overflow-hidden">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <Wine className="text-boutique-gold-muted/40" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-serif font-bold text-lg text-boutique-ink leading-tight">{item.product?.name}</h5>
                      <p className="text-sm text-boutique-muted mt-1">מחיר ליחידה: ₪{parseFloat(item.unit_price).toFixed(2)}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-serif font-bold text-xl text-boutique-burgundy">₪{parseFloat(item.total_price).toFixed(2)}</p>
                      <p className="text-[11px] font-medium text-boutique-muted mt-1 border border-boutique-linen px-2 py-0.5 rounded-sm text-center inline-block">כמות: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-5 border-t border-boutique-linen bg-white flex justify-end">
              <Button onClick={closeDetailsModal} variant="secondary">סגור חלונית</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}