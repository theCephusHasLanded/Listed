import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pinsReducer from './slices/pinsSlice';
import boardsReducer from './slices/boardsSlice';
import uiReducer from './slices/uiSlice';
import profileReducer from './slices/profileSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pins: pinsReducer,
    boards: boardsReducer,
    ui: uiReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'pins.currentPin'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;