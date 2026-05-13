import React, { useState, useEffect } from 'react';
import { Truck, FileSpreadsheet, Settings, Mail, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { axiosInstance } from '../api/axios';

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

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch bookings for stats
      const bookingsResponse = await axiosInstance.get('/bookings');
      const bookingsData = bookingsResponse.data || [];

      // Calculate stats
      const totalOrders = bookingsData.length;
      const totalRevenue = bookingsData.reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0);

      // Fetch products for low stock count
      const productsResponse = await axiosInstance.get('/products');
      const productsData = productsResponse.data || [];
      const lowStockProducts = productsData.filter(product => product.quantity < 10).length;

      // Fetch users count (if available)
      let totalUsers = 0;
      try {
        const usersResponse = await axiosInstance.get('/users');
        totalUsers = usersResponse.data?.length || 0;
      } catch (error) {
        // Users endpoint might not be accessible
        console.log('Could not fetch users count');
      }

      setStats({
        totalOrders,
        totalRevenue,
        lowStockProducts,
        totalUsers
      });
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
      // Refresh bookings
      await fetchBookings();
      await fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון סטטוס ההזמנה');
    } finally {
      setUpdatingStatus(null);
    }
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
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">לוח בקרה - מנהל מערכת</h2>
        <p className="text-slate-500 italic">ניהול מלאי, סטטוסים ודוחות מערכת</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-800 to-red-950 text-white">
          <p className="opacity-80 text-sm">סה"כ הזמנות (חודשי)</p>
          <h2 className="text-3xl font-bold">{stats.totalOrders}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">הכנסות החודש</p>
          <h2 className="text-3xl font-bold">₪{stats.totalRevenue.toFixed(2)}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">מוצרים במלאי נמוך</p>
          <h2 className="text-3xl font-bold text-red-600">{stats.lowStockProducts}</h2>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">לקוחות רשומים</p>
          <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
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
              {bookings.slice(0, 10).map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-medium">{booking.serial_number}</td>
                  <td>{booking.user?.name || 'לא זמין'}</td>
                  <td><Badge status={booking.status?.name || 'לא ידוע'} /></td>
                  <td className="font-bold">₪{parseFloat(booking.total_price).toFixed(2)}</td>
                  <td>
                    <select
                      className="bg-slate-100 border-none text-xs rounded p-1 disabled:opacity-50"
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
