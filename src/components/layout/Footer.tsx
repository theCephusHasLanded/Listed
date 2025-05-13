import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube 
} from 'lucide-react';

const Footer: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  return (
    <footer className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Listed</h2>
            </Link>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A platform for professionals affected by layoffs to connect, showcase their skills, and find new opportunities.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'}`}
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/blog" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/guides" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/accessibility" 
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-indigo-600'}`}
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-12 pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            &copy; {new Date().getFullYear()} Listed. All rights reserved.
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4 md:mt-0`}>
            Designed to help professionals connect and thrive
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;