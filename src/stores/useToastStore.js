'use client';

// Zustand store for toast notifications
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useToastStore = create(
  devtools(
    (set) => ({
      // State
      open: false,
      message: '',
      severity: 'success', // 'success' | 'error' | 'warning' | 'info'

      // Actions
      showToast: (message, severity = 'success') =>
        set({
          open: true,
          message,
          severity,
        }),

      hideToast: () => set({ open: false }),
    }),
    { name: 'ToastStore' }
  )
);

export default useToastStore;
