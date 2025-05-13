import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header';
import Footer from './Footer';
import CreatePinModal from '../pins/CreatePinModal';
import CreateBoardModal from '../boards/CreateBoardModal';
import NotificationsPanel from '../common/NotificationsPanel';
import ConfirmationModal from '../common/ConfirmationModal';

const Layout: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { 
    isCreatePinModalOpen, 
    isCreateBoardModalOpen, 
    isNotificationsOpen,
    isConfirmationModalOpen,
  } = useSelector((state: RootState) => state.ui);
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Modals */}
      {isCreatePinModalOpen && <CreatePinModal />}
      {isCreateBoardModalOpen && <CreateBoardModal />}
      {isNotificationsOpen && <NotificationsPanel />}
      {isConfirmationModalOpen && <ConfirmationModal />}
    </div>
  );
};

export default Layout;