import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);

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
      {/* Modals will be added here when implemented */}
    </div>
  );
};

export default Layout;