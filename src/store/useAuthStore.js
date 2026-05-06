import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../api/axios';

const MOCK_USERS = {
  admin: {
    email: 'admin@wine.com',
    password: 'password123',
    response: {
      user: { id: 1, name: 'Admin User', role: 'admin', email: 'admin@wine.com' },
      token: 'mock-admin-token-789'
    }
  },
  customer: {
    email: 'user@wine.com',
    password: 'password123',
    response: {
      user: { id: 2, name: 'Regular Customer', role: 'customer', email: 'user@wine.com' },
      token: 'mock-customer-token-456'
    }
  }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, 
      token: null, // The persist middleware will handle localStorage automatically
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          let mockData = null;
          if (email === MOCK_USERS.admin.email && password === MOCK_USERS.admin.password) {
            mockData = MOCK_USERS.admin.response;
          } else if (email === MOCK_USERS.customer.email && password === MOCK_USERS.customer.password) {
            mockData = MOCK_USERS.customer.response;
          }

          if (mockData) {
            const { user, token } = mockData;
            // No need for manual localStorage.setItem, persist does it!
            set({ user, token, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            throw new Error('Invalid email or password');
          }

        } catch (error) {
          set({ 
            error: error.message || 'Login failed. Please try again.', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage', // name of item in localStorage
    }
  )
);