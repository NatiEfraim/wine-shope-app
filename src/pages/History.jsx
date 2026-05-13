import React, { useState, useEffect } from 'react';
import { PackageOpen, X, MapPin, CreditCard, Wine } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { axiosInstance } from '../api/axios';

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 200); // Clear after animation
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mb-6">
           <PackageOpen size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">אין הזמנות עדיין</h2>
        <p className="text-slate-500 mb-6">העגלה שלך מחכה שתמלא אותה ביינות טובים!</p>
        <Button onClick={() => window.location.href = '/'}>
          מעבר לקטלוג
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">מעקב הזמנות</h2>
        <p className="text-slate-500 italic">עקוב אחרי ההזמנות שלך והיסטוריית הרכישות</p>
      </header>

      <div className="space-y-4 max-w-4xl mx-auto">
        {bookings.map(booking => (
          <Card key={booking.id} className="flex flex-col sm:flex-row justify-between items-center p-6 hover:shadow-md transition-shadow">
            <div className="mb-4 sm:mb-0 text-center sm:text-right w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <span className="font-black text-xl text-slate-800">הזמנה #{booking.serial_number}</span>
                <Badge status={booking.status?.name || 'לא ידוע'} />
              </div>
              <p className="text-sm text-slate-500">
                בוצעה ב: {new Date(booking.created_at).toLocaleString('he-IL')}
                <span className="mx-2">•</span>
                {booking.items?.length || 0} פריטים
              </p>
            </div>
            <div className="text-center sm:text-left flex flex-col sm:items-end w-full sm:w-auto">
              <p className="font-bold text-2xl text-red-800 mb-3">₪{parseFloat(booking.total_price).toFixed(2)}</p>
              <Button variant="outline" className="text-sm w-full sm:w-auto" onClick={() => openBookingDetails(booking)}>
                פרטי הזמנה
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-slate-50">
              <div>
                <h3 className="font-black text-2xl text-slate-800">הזמנה #{selectedBooking.serial_number}</h3>
                <p className="text-sm text-slate-500 mt-1">{new Date(selectedBooking.created_at).toLocaleString('he-IL')}</p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 bg-white rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Status & Info Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">סטטוס משלוח</p>
                      <div className="mt-1"><Badge status={selectedBooking.status?.name} /></div>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <CreditCard className="text-slate-400 mt-1" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">סה"כ לתשלום</p>
                      <p className="font-black text-lg text-slate-800">₪{parseFloat(selectedBooking.total_price).toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              {/* Items List */}
              <h4 className="font-bold text-slate-800 mb-4 text-lg border-b pb-2">פירוט פריטים</h4>
              <div className="space-y-4">
                {selectedBooking.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-16 h-16 bg-white border shadow-sm rounded-lg flex items-center justify-center text-2xl shrink-0 p-1">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-contain" />
                      ) : (
                        <Wine className="text-red-800 opacity-50" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-800">{item.product?.name || 'מוצר לא זמין'}</h5>
                      <p className="text-sm text-slate-500">₪{parseFloat(item.unit_price).toFixed(2)} ליחידה</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-lg text-slate-800">₪{parseFloat(item.total_price).toFixed(2)}</p>
                      <p className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">כמות: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <Button onClick={closeModal} variant="secondary">
                סגור חלונית
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}