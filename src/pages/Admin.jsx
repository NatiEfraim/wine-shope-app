import React, { useState, useEffect } from 'react';
import { Truck, FileSpreadsheet, Settings, Mail, CheckCircle, Eye, X, Wine, MapPin, CreditCard, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { axiosInstance } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  
  // Modal states for order details
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Navigation and Auth
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Check if user is Super Admin (Role ID 1)
  const isSuperAdmin = user?.role?.some(r => r.id === 1);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const extractArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(extractArray(response.data));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const bookingsResponse = await axiosInstance.get('/bookings');
      const bookingsData = extractArray(bookingsResponse.data);

      const totalOrders = bookingsData.length;
      const totalRevenue = bookingsData.reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0);

      const productsResponse = await axiosInstance.get('/products');
      const productsData = extractArray(productsResponse.data);
      const lowStockProducts = productsData.filter(product => product.quantity < 10).length;

      let totalUsers = 0;
      try {
        const usersResponse = await axiosInstance.get('/users');
        const usersData = extractArray(usersResponse.data);
        totalUsers = usersData.length;
      } catch (error) {
        console.log('Could not fetch users count');
      }

      setStats({ totalOrders, totalRevenue, lowStockProducts, totalUsers });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatusId) => {
    try {
      setUpdatingStatus(bookingId);
      await axiosInstance.put(`/bookings/${bookingId}`, {
        status_id: newStatusId
      });
      await fetchBookings();
      await fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון סטטוס ההזמנה');
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

  const statusOptions = [
    { id: 1, name: 'pending', label: 'ממתין לאישור' },
    { id: 2, name: 'approved', label: 'אושר' },
    { id: 3, name: 'delivered', label: 'נשלח' },
    { id: 4, name: 'completed', label: 'הושלם' },
  ];

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-4 text-slate-500">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 relative">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">לוח בקרה - ניהול מערכת</h2>
          <p className="text-slate-500 italic">מעקב אחר פעילות החנות, הזמנות ומלאי</p>
        </div>
        
        {/* Navigation button for super admins */}
        {isSuperAdmin && (
          <Button onClick={() => navigate('/admin/users')} className="flex items-center gap-2">
            <Users size={18} /> ניהול משתמשים והרשאות
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-800 to-red-950 text-white">
          <p className="opacity-80 text-sm">סה"כ הזמנות (כללי)</p>
          <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">הכנסות מצטברות</p>
          <h2 className="text-3xl font-bold text-slate-800">₪{stats.totalRevenue.toFixed(2)}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">מוצרים במלאי נמוך</p>
          <h2 className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">לקוחות רשומים</p>
          <h2 className="text-3xl font-bold text-slate-800">{stats.totalUsers}</h2>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <Truck size={20} className="text-red-800"/> ניהול הזמנות
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" className="text-xs">
              <FileSpreadsheet size={16}/> ייצוא XLSX
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-sm border-b">
                <th className="pb-3 pr-2">מזהה הזמנה</th>
                <th className="pb-3">לקוח</th>
                <th className="pb-3">סטטוס</th>
                <th className="pb-3">סכום</th>
                <th className="pb-3">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 font-bold text-slate-700">#{booking.serial_number}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{booking.user?.name}</span>
                      <span className="text-xs text-slate-400">{booking.user?.email}</span>
                    </div>
                  </td>
                  <td><Badge status={booking.status?.name || 'לא ידוע'} /></td>
                  <td className="font-bold text-slate-800">₪{parseFloat(booking.total_price).toFixed(2)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-white border border-slate-200 text-xs rounded-lg p-1.5 focus:ring-1 focus:ring-red-800 outline-none"
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
                        className="p-1.5 text-slate-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
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

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4" dir="rtl">
            
            <div className="flex justify-between items-center p-6 border-b bg-slate-50">
              <div>
                <h3 className="font-black text-2xl text-slate-800">פרטי הזמנה #{selectedBooking.serial_number}</h3>
                <p className="text-sm text-slate-500 mt-1">{new Date(selectedBooking.created_at).toLocaleString('he-IL')}</p>
              </div>
              <button onClick={closeDetailsModal} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-600 shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 mb-6 flex items-start gap-4">
                <div className="bg-red-800 text-white p-2 rounded-lg"><User size={20}/></div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-1 w-full">
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">שם הלקוח</p><p className="font-bold text-slate-800">{selectedBooking.user?.name}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">תעודת זהות</p><p className="font-bold text-slate-800">{selectedBooking.user?.personal_id}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">אימייל</p><p className="font-medium text-slate-600 text-sm">{selectedBooking.user?.email}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">טלפון</p><p className="font-medium text-slate-600 text-sm">{selectedBooking.user?.phone}</p></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">סטטוס נוכחי</p>
                      <div className="mt-1"><Badge status={selectedBooking.status?.name} /></div>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <CreditCard className="text-slate-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">סה"כ הזמנה</p>
                      <p className="font-black text-lg text-slate-800">₪{parseFloat(selectedBooking.total_price).toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-4 text-lg border-b pb-2">רשימת יינות בהזמנה</h4>
              <div className="space-y-4">
                {selectedBooking.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                    <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-contain" />
                      ) : (
                        <Wine className="text-red-800/40" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-800 leading-tight">{item.product?.name}</h5>
                      <p className="text-xs text-slate-500">מחיר ליחידה: ₪{parseFloat(item.unit_price).toFixed(2)}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-slate-800">₪{parseFloat(item.total_price).toFixed(2)}</p>
                      <p className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">כמות: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <Button onClick={closeDetailsModal} variant="secondary">סגור</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}