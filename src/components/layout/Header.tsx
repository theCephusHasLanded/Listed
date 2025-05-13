import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  Plus, 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  BookOpen, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { 
  setSearchTerm, 
  toggleCreatePinModal, 
  toggleCreateBoardModal, 
  toggleNotifications,
  toggleDarkMode,
  toggleMobileMenu,
} from '../../store/slices/uiSlice';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const createDropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchTerm, darkMode, isMobileMenuOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setCreateDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdowns when location changes
  useEffect(() => {
    setDropdownOpen(false);
    setCreateDropdownOpen(false);
    dispatch(toggleMobileMenu());
  }, [location, dispatch]);
  
  return (
    <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and search (desktop) */}
          <div className="flex items-center space-x-6 flex-1">
            <Link to="/" className="flex items-center">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Listed
              </h1>
            </Link>
            
            <form onSubmit={handleSearch} className="hidden md:block relative flex-1 max-w-lg">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
              <input
                type="text"
                placeholder="Search talents, services, skills..."
                className={`pl-10 pr-4 py-2 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 border`}
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
            </form>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-2 rounded-md focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            )}
          </button>
          
          {/* Navigation (desktop) */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/'
                  ? 'font-medium text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/search"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/search'
                  ? 'font-medium text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Explore
            </Link>
            
            {user && (
              <>
                <Link
                  to="/boards"
                  className={`px-3 py-2 rounded-md ${
                    location.pathname === '/boards'
                      ? 'font-medium text-indigo-600'
                      : darkMode
                      ? 'text-gray-200 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Boards
                </Link>
                
                {/* Create dropdown */}
                <div className="relative" ref={createDropdownRef}>
                  <button
                    onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      darkMode
                        ? 'text-gray-200 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Create
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {createDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg py-1 z-30`}>
                      <button
                        onClick={() => {
                          dispatch(toggleCreatePinModal());
                          setCreateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        Create Pin
                      </button>
                      <button
                        onClick={() => {
                          dispatch(toggleCreateBoardModal());
                          setCreateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        Create Board
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Notifications */}
                <button
                  onClick={() => dispatch(toggleNotifications())}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </button>
              </>
            )}
            
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            
            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg py-1 z-50`}>
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/profile/bookings"
                      className={`block px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Bookings
                    </Link>
                    
                    <Link
                      to="/profile/settings"
                      className={`block px-4 py-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'} flex items-center`}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Mobile search (shown on small screens) */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 border`}
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>
        </form>
        
        {/* Mobile menu (shown on small screens) */}
        {isMobileMenuOpen && (
          <nav className={`md:hidden mt-4 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
            <Link
              to="/"
              className={`block px-4 py-2 rounded-md ${
                location.pathname === '/'
                  ? 'font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : darkMode
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/search"
              className={`block px-4 py-2 rounded-md ${
                location.pathname === '/search'
                  ? 'font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : darkMode
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Explore
            </Link>
            
            {user && (
              <>
                <Link
                  to="/boards"
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === '/boards'
                      ? 'font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Boards
                </Link>
                
                <Link
                  to="/profile"
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === '/profile'
                      ? 'font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    dispatch(toggleCreatePinModal());
                    dispatch(toggleMobileMenu());
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Create Pin
                </button>
                
                <button
                  onClick={() => {
                    dispatch(toggleCreateBoardModal());
                    dispatch(toggleMobileMenu());
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Create Board
                </button>
                
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 rounded-md ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                >
                  Sign out
                </button>
              </>
            )}
            
            {!user && (
              <div className="px-4 py-2 space-y-2">
                <Link
                  to="/login"
                  className={`block px-4 py-2 w-full text-center rounded-full ${darkMode ? 'text-white border border-gray-600' : 'text-gray-900 border border-gray-300'}`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 w-full text-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className={`flex items-center px-4 py-2 rounded-md w-full ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-5 h-5 mr-3 text-yellow-400" />
                    Light mode
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 mr-3" />
                    Dark mode
                  </>
                )}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;