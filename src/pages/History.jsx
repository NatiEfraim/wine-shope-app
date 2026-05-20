import React, { useState, useEffect } from 'react';
import { PackageOpen, X, MapPin, CreditCard, Wine, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-burgundy mx-auto"></div>
        <p className="mt-4 text-boutique-muted">טוען את היסטוריית ההזמנות שלך...</p>
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

  // Empty state matching Meni's Cart design
  if (bookings.length === 0) {
    return (
      <div className="animate-in fade-in border border-dashed border-boutique-gold/35 bg-boutique-cream py-20 text-center shadow-boutique rounded-sm" dir="rtl">
        <PackageOpen size={64} className="mx-auto mb-4 text-boutique-gold/45" strokeWidth={1.25} />
        <h2 className="font-serif text-3xl font-semibold text-boutique-ink">אין הזמנות עדיין</h2>
        <p className="mb-6 mt-2 text-boutique-muted">היסטוריית הרכישות שלך ריקה. נשמח לראות אותך בקטלוג!</p>
        <Link to="/">
          <Button variant="outline" className="mx-auto">
            <ArrowRight size={16} /> מעבר לקטלוג
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative" dir="rtl">
      <header className="mb-12 border-b border-boutique-linen pb-6 text-right">
        <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
          Order History
        </p>
        <h2 className="font-serif text-4xl font-bold text-boutique-ink mb-2">מעקב הזמנות</h2>
        <p className="text-boutique-muted font-sans text-sm">עקוב אחרי ההזמנות שלך והיסטוריית הרכישות מהבוטיק</p>
      </header>

      <div className="space-y-6 max-w-4xl mx-auto">
        {bookings.map(booking => (
          <Card key={booking.id} className="flex flex-col sm:flex-row justify-between items-center p-6 hover:shadow-boutique-lg transition-shadow bg-white">
            <div className="mb-4 sm:mb-0 text-center sm:text-right w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
                <span className="font-serif font-bold text-2xl text-boutique-ink">הזמנה #{booking.serial_number}</span>
                <Badge status={booking.status?.name || 'לא ידוע'} />
              </div>
              <p className="font-sans text-sm text-boutique-muted">
                בוצעה ב: {new Date(booking.created_at).toLocaleString('he-IL')}
                <span className="mx-3 text-boutique-linen">|</span>
                {booking.items?.length || 0} פריטים
              </p>
            </div>
            <div className="text-center sm:text-left flex flex-col sm:items-end w-full sm:w-auto">
              <p className="font-serif font-bold text-3xl text-boutique-burgundy mb-4">₪{parseFloat(booking.total_price).toFixed(2)}</p>
              <Button variant="outline" className="text-sm w-full sm:w-auto px-6" onClick={() => openBookingDetails(booking)}>
                צפייה בפרטים
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-boutique-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-boutique-cream rounded-sm shadow-2xl border border-boutique-gold/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300" dir="rtl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-boutique-linen bg-white">
              <div>
                <h3 className="font-serif font-bold text-2xl text-boutique-ink">הזמנה #{selectedBooking.serial_number}</h3>
                <p className="text-sm text-boutique-muted mt-1 font-sans">{new Date(selectedBooking.created_at).toLocaleString('he-IL')}</p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 bg-boutique-parchment rounded-full text-boutique-muted hover:text-boutique-burgundy transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              
              {/* Status & Info Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white p-5 rounded-sm border border-boutique-linen flex items-start gap-3 shadow-sm">
                    <MapPin className="text-boutique-gold-muted mt-1" size={20} />
                    <div>
                      <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury mb-1">סטטוס משלוח</p>
                      <div><Badge status={selectedBooking.status?.name} /></div>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-sm border border-boutique-linen flex items-start gap-3 shadow-sm">
                    <CreditCard className="text-boutique-gold-muted mt-1" size={20} />
                    <div>
                      <p className="text-[10px] text-boutique-gold-muted font-medium uppercase tracking-luxury mb-1">סה"כ לתשלום</p>
                      <p className="font-serif font-bold text-2xl text-boutique-burgundy">₪{parseFloat(selectedBooking.total_price).toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              {/* Items List */}
              <h4 className="font-serif font-bold text-boutique-ink mb-4 text-xl border-b border-boutique-linen pb-2">פירוט פריטים</h4>
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
                      <h5 className="font-serif font-bold text-lg text-boutique-ink leading-tight">{item.product?.name || 'מוצר לא זמין'}</h5>
                      <p className="text-sm text-boutique-muted mt-1">₪{parseFloat(item.unit_price).toFixed(2)} ליחידה</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-serif font-bold text-xl text-boutique-ink">₪{parseFloat(item.total_price).toFixed(2)}</p>
                      <p className="text-[11px] font-medium text-boutique-muted mt-1 border border-boutique-linen px-2 py-0.5 rounded-sm text-center inline-block">כמות: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-boutique-linen bg-white flex justify-end">
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