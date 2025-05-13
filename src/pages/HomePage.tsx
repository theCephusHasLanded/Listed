import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Heart, Bookmark, Share2, MapPin, DollarSign, Star, Clock, Filter } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchPins, setCurrentPin } from '../store/slices/pinsSlice';
import { setSelectedFilter } from '../store/slices/uiSlice';
import { Pin, FilterCategory } from '../types';

const HomePage: React.FC = () => {
  const { pins, loading, hasMore } = useSelector((state: RootState) => state.pins);
  const { searchTerm, selectedFilter, darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTalent, setSelectedTalent] = useState<Pin | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPinElementRef = useRef<HTMLDivElement | null>(null);
  
  // Fetch pins when component mounts or filter changes
  useEffect(() => {
    dispatch(fetchPins({ category: selectedFilter, limitCount: 12 }));
  }, [dispatch, selectedFilter]);
  
  // Setup infinite scrolling
  useEffect(() => {
    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create new observer for infinite scrolling
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        dispatch(fetchPins({ category: selectedFilter, limitCount: 12 }));
      }
    }, { rootMargin: '100px' });
    
    // Observe the last pin element
    if (lastPinElementRef.current) {
      observer.current.observe(lastPinElementRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [dispatch, hasMore, loading, pins.length, selectedFilter]);
  
  const categories: { id: FilterCategory; name: string; icon: string }[] = [
    { id: 'all', name: 'All Talent', icon: '🌟' },
    { id: 'tech', name: 'Tech & Development', icon: '💻' },
    { id: 'design', name: 'Design & Creative', icon: '🎨' },
    { id: 'marketing', name: 'Marketing & Growth', icon: '📈' },
    { id: 'finance', name: 'Finance & Strategy', icon: '💰' },
    { id: 'leadership', name: 'Leadership & Coaching', icon: '🚀' }
  ];
  
  // Filter pins based on search term and category
  const filteredPins = pins.filter(pin => {
    const matchesSearch = 
      pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pin.description && pin.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pin.services && pin.services.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    return matchesSearch;
  });
  
  const handlePinClick = (pin: Pin) => {
    dispatch(setCurrentPin(pin));
    setSelectedTalent(pin);
  };
  
  const handleCategoryClick = (categoryId: FilterCategory) => {
    dispatch(setSelectedFilter(categoryId));
  };
  
  // Create loading skeleton elements for when pins are being fetched
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, idx) => (
      <div key={`skeleton-${idx}`} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm animate-pulse`}>
        <div className="h-32 bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-4">
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 -mt-10"></div>
            <div className="ml-auto mt-2 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex flex-wrap gap-1 mb-3">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-20"></div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Categories */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-16 z-30`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedFilter === category.id
                    ? `${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredPins.length === 0 && !loading ? (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPins.map((pin, index) => {
              // Check if this is the last pin
              const isLastPin = index === filteredPins.length - 1;
              
              return (
                <div
                  key={pin.id}
                  ref={isLastPin ? lastPinElementRef : null}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer pin-item`}
                  onClick={() => handlePinClick(pin)}
                >
                  {/* Cover Image */}
                  <div className="relative h-48">
                    <img
                      src={pin.image}
                      alt={pin.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button 
                        className={`p-1.5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-sm hover:shadow-md`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      <button 
                        className={`p-1.5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-sm hover:shadow-md`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Bookmark className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="relative px-4 pb-4">
                    <div className="absolute -top-12 left-4">
                      <img
                        src={pin.ownerPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(pin.ownerName)}&background=random`}
                        alt={pin.ownerName}
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                      />
                    </div>

                    <div className="pt-14">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pin.ownerName}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{pin.title}</p>
                        </div>
                        {pin.rating && pin.rating >= 4.8 && (
                          <div className={`${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'} p-1 rounded-full`}>
                            <Star className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {pin.services && pin.services.slice(0, 2).map((service, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                            >
                              {service}
                            </span>
                          ))}
                          {pin.services && pin.services.length > 2 && (
                            <span className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                              +{pin.services.length - 2}
                            </span>
                          )}
                        </div>

                        {(pin.rate || pin.availability) && (
                          <div className="flex items-center justify-between text-sm">
                            {pin.rate && (
                              <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {pin.rate}
                              </div>
                            )}
                            {pin.availability && (
                              <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Clock className="w-3 h-3 mr-1" />
                                {pin.availability}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          {pin.location && (
                            <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <MapPin className="w-3 h-3 mr-1" />
                              {pin.location}
                            </div>
                          )}
                          {pin.rating && (
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {pin.rating}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span>{pin.saveCount} pins</span>
                        <span>{pin.bookingCount} bookings</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show loading skeletons when loading more pins */}
            {loading && renderSkeletons()}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTalent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTalent(null)}
        >
          <div 
            className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
              <h2 className="text-xl font-semibold">Talent Profile</h2>
              <button
                onClick={() => setSelectedTalent(null)}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedTalent.ownerPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTalent.ownerName)}&background=random`}
                  alt={selectedTalent.ownerName}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{selectedTalent.ownerName}</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedTalent.title}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link 
                      to={`/user/${selectedTalent.ownerId}`}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                    >
                      View Profile
                    </Link>
                    <button className={`px-6 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}>
                      Pin to Board
                    </button>
                    <button className={`p-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}>
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {selectedTalent.services && selectedTalent.services.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalent.services.map((service, idx) => (
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

                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTalent.rate && (
                      <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{selectedTalent.rate}</span>
                      </div>
                    )}
                    {selectedTalent.availability && (
                      <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{selectedTalent.availability}</span>
                      </div>
                    )}
                    {selectedTalent.location && (
                      <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{selectedTalent.location}</span>
                      </div>
                    )}
                    {selectedTalent.rating && (
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        <span>{selectedTalent.rating} rating</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedTalent.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Stats</h4>
                  <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                    <span>{selectedTalent.saveCount} people pinned this</span>
                    <span>{selectedTalent.bookingCount} successful bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;