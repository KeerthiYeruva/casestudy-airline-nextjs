'use client';

// Zustand store for toast notifications
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ToastStore } from '@/types';

const useToastStore = create<ToastStore>()(
  devtools(
    (set) => ({
      // State
      open: false,
      message: '',
      severity: 'success',

      // Actions
      showToast: (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') =>
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
