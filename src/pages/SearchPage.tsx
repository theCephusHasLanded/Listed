import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Star, 
  Clock, 
  Filter, 
  X, 
  List, 
  Grid as GridIcon
} from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchPins } from '../store/slices/pinsSlice';
import { setSearchTerm, setSelectedFilter } from '../store/slices/uiSlice';
import { FilterCategory } from '../types';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('q') || '';
  
  const { pins, loading } = useSelector((state: RootState) => state.pins);
  const { searchTerm, selectedFilter, darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchTerm) {
      dispatch(setSearchTerm(queryFromUrl));
    }
    
    dispatch(fetchPins({ category: selectedFilter }));
  }, [dispatch, queryFromUrl, searchTerm, selectedFilter]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchPins({ category: selectedFilter }));
  };
  
  const handleFilterChange = (filter: FilterCategory) => {
    dispatch(setSelectedFilter(filter));
  };
  
  const categories: { id: FilterCategory; name: string; icon: string }[] = [
    { id: 'all', name: 'All Talent', icon: '🌟' },
    { id: 'tech', name: 'Tech & Development', icon: '💻' },
    { id: 'design', name: 'Design & Creative', icon: '🎨' },
    { id: 'marketing', name: 'Marketing & Growth', icon: '📈' },
    { id: 'finance', name: 'Finance & Strategy', icon: '💰' },
    { id: 'leadership', name: 'Leadership & Coaching', icon: '🚀' }
  ];
  
  // Filter pins based on search term
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
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Explore Talent'}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <div className="border-r border-gray-300 dark:border-gray-700 h-6"></div>
            
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                  : darkMode 
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <GridIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                  : darkMode 
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Search talents, services, skills..."
              className={`pl-10 pr-4 py-3 w-full ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => dispatch(setSearchTerm(''))}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
        
        {showFilters && (
          <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
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
        )}
        
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm ${viewMode === 'grid' ? 'h-64' : 'h-32'} skeleton`}>
              </div>
            ))}
          </div>
        ) : filteredPins.length > 0 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {filteredPins.map(pin => (
              viewMode === 'grid' ? (
                <Link
                  key={pin.id}
                  to={`/pin/${pin.id}`}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={pin.image}
                      alt={pin.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pin.title}
                    </h3>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pin.ownerName}
                    </p>
                    {pin.services && pin.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {pin.services.slice(0, 1).map((service, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                          >
                            {service}
                          </span>
                        ))}
                        {pin.services.length > 1 && (
                          <span className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                            +{pin.services.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  key={pin.id}
                  to={`/pin/${pin.id}`}
                  className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4`}
                >
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pin.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {pin.ownerName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      {pin.location && (
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-3 h-3 mr-1" />
                          {pin.location}
                        </div>
                      )}
                      {pin.rate && (
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <DollarSign className="w-3 h-3 mr-1" />
                          {pin.rate}
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
                </Link>
              )
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="mb-6">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                dispatch(setSearchTerm(''));
                dispatch(setSelectedFilter('all'));
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;