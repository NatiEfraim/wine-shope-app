import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { axiosInstance } from '../api/axios';

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/bookings/my-bookings');
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-4 text-slate-500">טוען הזמנות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBookings} className="mt-4">
          נסה שוב
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">אין הזמנות עדיין</h2>
        <p className="text-slate-500">כשתבצע הזמנות, הן יופיעו כאן</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">מעקב הזמנות</h2>
        <p className="text-slate-500 italic">עקוב אחרי ההזמנות שלך והיסטוריית הרכישות</p>
      </header>

      <div className="space-y-4 max-w-4xl mx-auto">
        {bookings.map(booking => (
          <Card key={booking.id} className="flex justify-between items-center p-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg">הזמנה #{booking.serial_number}</span>
                <Badge status={booking.status?.name || 'לא ידוע'} />
              </div>
              <p className="text-sm text-slate-400">
                בוצעה בתאריך: {new Date(booking.created_at).toLocaleDateString('he-IL')} •
                {booking.items?.length || 0} פריטים
              </p>
            </div>
            <div className="text-left">
              <p className="font-bold text-xl mb-2">₪{parseFloat(booking.total_price).toFixed(2)}</p>
              <Button variant="outline" className="text-xs">
                פרטי הזמנה
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
