import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../api/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // This sets the StoreApiToken cookie in the browser
          await axiosInstance.post('/auth/login', {
            email,
            password,
          });

          // Now this request will automatically have the token injected by our Axios interceptor!
          const userResponse = await axiosInstance.get('/auth/user');
          const user = userResponse.data.data || userResponse.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });

          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          await axiosInstance.post('/auth/register', userData);
          return await get().login(userData.email, userData.password);
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
          // Important: You might want to manually clear the cookie here just in case,
          // though Netanel's backend uses Cookie::forget() which tells the browser to delete it.
          document.cookie = 'StoreApiToken=; Max-Age=0; path=/;';
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false
          });
        }
      },

      fetchUser: async () => {
        try {
          const userResponse = await axiosInstance.get('/auth/user');
          const user = userResponse.data.data || userResponse.data;
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Fetch user error:', error);
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      // We only persist user state, token is handled by browser cookies
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);