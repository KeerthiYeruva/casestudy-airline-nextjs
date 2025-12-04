'use client';

import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/slices/dataSlice";
import checkInReducer from "@/slices/checkInSlice";
import adminReducer from "@/slices/adminSlice";
import authReducer from "@/slices/authSlice";
import toastReducer from "@/slices/toastSlice";

const store = configureStore({
  reducer: {
    data: dataReducer,
    checkIn: checkInReducer,
    admin: adminReducer,
    auth: authReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/loginSuccess",
          "auth/setUser",
          "auth/loginWithGoogle/fulfilled",
          "auth/loginWithGoogle/pending",
        ],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export default store;

