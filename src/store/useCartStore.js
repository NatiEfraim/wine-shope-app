import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../api/axios';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => set((state) => {
        const existing = state.cart.find(p => p.id === product.id);
        if (existing) {
          const newQty = existing.qty + 1;
          if (product.quantity < newQty) {
            alert(`לא ניתן להוסיף יותר מ-${product.quantity} יחידות מהמוצר הזה`);
            return state;
          }
          return {
            cart: state.cart.map(p => p.id === product.id ? { ...p, qty: newQty } : p)
          };
        }
        if (product.quantity < 1) {
          alert('המוצר אינו זמין במלאי');
          return state;
        }
        return { cart: [...state.cart, { ...product, qty: 1 }] };
      }),

      updateQty: (id, delta) => set((state) => ({
        cart: state.cart.map(p => {
          if (p.id === id) {
            const newQty = Math.max(0, p.qty + delta);
            if (newQty > p.quantity) {
              alert(`לא ניתן להזמין יותר מ-${p.quantity} יחידות מהמוצר הזה`);
              return p;
            }
            return { ...p, qty: newQty };
          }
          return p;
        }).filter(p => p.qty > 0)
      })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce((sum, item) => {
          const priceAfterDiscount = item.price_after_discount || item.price;
          return sum + (priceAfterDiscount * item.qty);
        }, 0);
      },

      getTotalItems: () => {
        return get().cart.reduce((sum, item) => sum + item.qty, 0);
      },

      checkout: async (guestData = {}) => {
        const cart = get().cart;
        if (cart.length === 0) return false;

        try {
          const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.qty
          }));

          const response = await axiosInstance.post('/bookings', { items, ...guestData });

          if (response.status === 201) {
            get().clearCart();
            return true;
          }
          return false;
        } catch (error) {
          console.error('Checkout error:', error);
          alert(error.response?.data?.message || 'שגיאה בביצוע ההזמנה');
          return false;
        }
      }
    }),
    { name: 'cart-storage' }
  )
);