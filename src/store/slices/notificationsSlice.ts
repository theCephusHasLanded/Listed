import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Notification } from '../../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Fetch user notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: string, { rejectWithValue }) => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(notificationsQuery);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      // Count unread notifications
      const unreadCount = notifications.filter(notification => !notification.read).length;
      
      return { notifications, unreadCount };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
      
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { notifications: NotificationsState };
      const { notifications } = state.notifications;
      
      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      const updatePromises = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
        })
      );
      
      await Promise.all(updatePromises);
      
      return unreadNotifications.map(notification => notification.id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
      });
  },
});

export const { clearNotificationsError } = notificationsSlice.actions;

export default notificationsSlice.reducer;