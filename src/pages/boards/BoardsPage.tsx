import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Grid, 
  List, 
  Search, 
  Lock, 
  Filter,
  X,
  User
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchUserBoards } from '../../store/slices/boardsSlice';
import { toggleCreateBoardModal } from '../../store/slices/uiSlice';

const BoardsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { boards, loading } = useSelector((state: RootState) => state.boards);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivate, setFilterPrivate] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserBoards(user.uid));
    }
  }, [dispatch, user]);
  
  // Filter boards based on search and privacy filter
  const filteredBoards = boards.filter(board => {
    const matchesSearch = 
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (board.description && board.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (board.tags && board.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesPrivacy = 
      filterPrivate === null || board.private === filterPrivate;
    
    return matchesSearch && matchesPrivacy;
  });
  
  const handleCreateBoard = () => {
    dispatch(toggleCreateBoardModal());
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Boards
          </h1>
          
          <button
            onClick={handleCreateBoard}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Board
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="border-r border-gray-300 dark:border-gray-700 h-6 mx-2"></div>
            
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
              <Grid className="w-5 h-5" />
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
            
            <div className="border-r border-gray-300 dark:border-gray-700 h-6 mx-2"></div>
            
            <div className="flex items-center">
              <Filter className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              <select
                value={filterPrivate === null ? 'all' : filterPrivate ? 'private' : 'public'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') setFilterPrivate(null);
                  else if (value === 'private') setFilterPrivate(true);
                  else setFilterPrivate(false);
                }}
                className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="all">All Boards</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          // Loading skeletons
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm ${viewMode === 'grid' ? 'h-64' : 'h-24'} skeleton`}>
              </div>
            ))}
          </div>
        ) : filteredBoards.length > 0 ? (
          // Board list
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredBoards.map(board => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`}
                >
                  <div className="h-32 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                    {board.coverImage && (
                      <img
                        src={board.coverImage}
                        alt={board.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {board.private && (
                      <div className="absolute top-2 right-2">
                        <div className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                          <Lock className="w-4 h-4 text-indigo-500" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {board.title}
                    </h3>
                    {board.description && (
                      <p className={`text-sm line-clamp-2 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {board.description}
                      </p>
                    )}
                    {board.tags && board.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {board.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                          >
                            #{tag}
                          </span>
                        ))}
                        {board.tags.length > 3 && (
                          <span className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                            +{board.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between`}>
                    <div className="flex items-center">
                      {board.ownerPhoto ? (
                        <img 
                          src={board.ownerPhoto} 
                          alt={board.ownerName} 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <User className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {board.ownerName}
                      </span>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {board.pinCount} pins
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBoards.map(board => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-shadow p-4`}
                >
                  <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md mr-4 flex-shrink-0 relative overflow-hidden">
                    {board.coverImage && (
                      <img
                        src={board.coverImage}
                        alt={board.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {board.private && (
                      <div className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-50 rounded-tl-md">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {board.title}
                      </h3>
                      <div className="flex items-center">
                        <span className={`text-xs mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {board.pinCount} pins
                        </span>
                        <div className="flex items-center">
                          {board.ownerPhoto ? (
                            <img 
                              src={board.ownerPhoto} 
                              alt={board.ownerName} 
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <User className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {board.description && (
                      <p className={`text-sm line-clamp-1 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {board.description}
                      </p>
                    )}
                    {board.tags && board.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {board.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                          >
                            #{tag}
                          </span>
                        ))}
                        {board.tags.length > 3 && (
                          <span className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                            +{board.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          // Empty state
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No boards found</h3>
            <p className="mb-6">
              {searchTerm || filterPrivate !== null
                ? "No boards match your current filters."
                : "You haven't created any boards yet."}
            </p>
            <button
              onClick={handleCreateBoard}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Create Your First Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardsPage;