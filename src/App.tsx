import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { setUser } from './store/slices/authSlice';
import { RootState } from './store';

// Page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import BoardsPage from './pages/boards/BoardsPage';
import BoardDetailPage from './pages/boards/BoardDetailPage';
import PinDetailPage from './pages/pins/PinDetailPage';
import CreatePinPage from './pages/pins/CreatePinPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/profile/SettingsPage';
import BookingsPage from './pages/profile/BookingsPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserPinsPage from './pages/profile/UserPinsPage';
import UserBoardsPage from './pages/profile/UserBoardsPage';
import ConnectionsPage from './pages/profile/ConnectionsPage';
import BookingModal from './components/booking/BookingModal';
import ProfileEditModal from './components/profile/ProfileEditModal';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isBookingModalOpen, isEditProfileModalOpen } = useSelector((state: RootState) => state.ui);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          // User exists, update the last active timestamp
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastActive: Date.now(),
          });
          
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userDoc.data(),
          }));
        } else {
          // Create new user in Firestore
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL,
            verified: false,
            createdAt: Date.now(),
            lastActive: Date.now(),
            boardCount: 0,
            pinCount: 0,
            connectionsCount: 0,
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          dispatch(setUser(newUser));
        }
      } else {
        dispatch(setUser(null));
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [dispatch]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="pin/:pinId" element={<PinDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="create-pin" element={<CreatePinPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/pins" element={<UserPinsPage />} />
            <Route path="profile/boards" element={<UserBoardsPage />} />
            <Route path="profile/connections" element={<ConnectionsPage />} />
            <Route path="profile/bookings" element={<BookingsPage />} />
            <Route path="profile/settings" element={<SettingsPage />} />
            <Route path="boards" element={<BoardsPage />} />
            <Route path="board/:boardId" element={<BoardDetailPage />} />
          </Route>
          
          {/* User profile routes - public but with protected actions */}
          <Route path="user/:userId" element={<ProfilePage />} />
          <Route path="user/:userId/pins" element={<UserPinsPage />} />
          <Route path="user/:userId/boards" element={<UserBoardsPage />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      
      {/* Global Modals */}
      {isBookingModalOpen && <BookingModal />}
      {isEditProfileModalOpen && <ProfileEditModal />}
    </>
  );
};

export default App;