import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Using persist middleware to save cart to localStorage
export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(p => p.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
          };
        }
        return { cart: [...state.cart, { ...product, qty: 1 }] };
      }),

      updateQty: (id, delta) => set((state) => ({
        cart: state.cart.map(p => {
          if (p.id === id) {
            const newQty = Math.max(0, p.qty + delta);
            return { ...p, qty: newQty };
          }
          return p;
        }).filter(p => p.qty > 0)
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage', // name of item in localStorage
    }
  )
);