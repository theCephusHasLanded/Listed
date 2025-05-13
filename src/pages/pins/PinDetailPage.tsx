import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  Star, 
  MessageSquare 
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchPinById } from '../../store/slices/pinsSlice';
import { toggleBookingModal } from '../../store/slices/uiSlice';

const PinDetailPage: React.FC = () => {
  const { pinId } = useParams<{ pinId: string }>();
  const { currentPin, loading, error } = useSelector((state: RootState) => state.pins);
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (pinId) {
      dispatch(fetchPinById(pinId));
    }
  }, [dispatch, pinId]);
  
  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(toggleBookingModal());
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center mb-8">
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
                
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !currentPin) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Pin not found</h3>
            <p className="mb-6">
              The pin you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <img
                src={currentPin.image}
                alt={currentPin.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentPin.title}
            </h1>
            
            {/* User Info */}
            <Link 
              to={`/user/${currentPin.ownerId}`}
              className="flex items-center mb-6"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                {currentPin.ownerPhoto ? (
                  <img 
                    src={currentPin.ownerPhoto} 
                    alt={currentPin.ownerName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-lg font-semibold ${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {currentPin.ownerName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentPin.ownerName}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  View Profile
                </p>
              </div>
            </Link>
            
            {/* Services */}
            {currentPin.services && currentPin.services.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Services Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPin.services.map((service, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            {currentPin.description && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Description
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentPin.description}
                </p>
              </div>
            )}
            
            {/* Details */}
            <div className="mb-6">
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {currentPin.rate && (
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                    <span>{currentPin.rate}</span>
                  </div>
                )}
                {currentPin.location && (
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                    <span>{currentPin.location}</span>
                  </div>
                )}
                {currentPin.availability && (
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                    <span>{currentPin.availability}</span>
                  </div>
                )}
                {currentPin.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 mr-2 fill-current" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {currentPin.rating} Rating
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tags */}
            {currentPin.tags && currentPin.tags.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentPin.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full text-sm`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="mb-6 flex items-center space-x-6">
              <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Bookmark className="w-5 h-5 mr-1" />
                <span>{currentPin.saveCount} saves</span>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageSquare className="w-5 h-5 mr-1" />
                <span>{currentPin.bookingCount} bookings</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleBookNow}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Book Now
              </button>
              <button className={`px-6 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}>
                <Bookmark className="w-4 h-4 inline mr-2" />
                Save to Board
              </button>
              <button className={`p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}>
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailPage;