import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <div className="text-8xl mb-6">🔍</div>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          We couldn't find the page you're looking for. The page may have been moved or doesn't exist.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;