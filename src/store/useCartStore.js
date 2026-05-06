import { create } from 'zustand';

// Store for managing shopping cart state globally
export const useCartStore = create((set) => ({
  cart: [],
  
  // Add product or increase quantity
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(p => p.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
      };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),

  // Update item quantity or remove if qty is 0
  updateQty: (id, delta) => set((state) => ({
    cart: state.cart.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }).filter(p => p.qty > 0)
  })),

  // Clear cart after checkout
  clearCart: () => set({ cart: [] }),
}));