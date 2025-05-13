import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronLeft, 
  Plus, 
  Edit, 
  Trash, 
  MoreHorizontal, 
  Lock, 
  Share2, 
  Users, 
  UserPlus, 
  Filter,
  Grid,
  List,
  Search,
  X
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchBoardById, deleteBoard } from '../../store/slices/boardsSlice';
import { showConfirmationModal } from '../../store/slices/uiSlice';

const BoardDetailPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { currentBoard, boardPins, loading, error } = useSelector((state: RootState) => state.boards);
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardById(boardId));
    }
  }, [dispatch, boardId]);
  
  // Check if current user is the owner
  const isOwner = currentBoard && user && currentBoard.ownerId === user.uid;
  
  // Check if current user is a collaborator
  const isCollaborator = 
    currentBoard && 
    user && 
    currentBoard.collaborators && 
    currentBoard.collaborators.includes(user.uid);
  
  // Filter pins based on search
  const filteredPins = boardPins.filter(pin => 
    pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pin.description && pin.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pin.services && pin.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );
  
  const handleDeleteBoard = () => {
    if (!boardId) return;
    
    dispatch(showConfirmationModal({
      message: 'Are you sure you want to delete this board? This action cannot be undone.',
      action: () => {
        dispatch(deleteBoard(boardId)).then(() => {
          navigate('/boards');
        });
      }
    }));
  };
  
  if (loading && !currentBoard) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                <div key={idx} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !currentBoard) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Board not found</h3>
            <p className="mb-6">
              The board you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link 
              to="/boards"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Back to Your Boards
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if the board is private and the user doesn't have access
  if (currentBoard.private && !isOwner && !isCollaborator) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">This board is private</h3>
            <p className="mb-6">
              You need permission from the board owner to view this content.
            </p>
            <Link 
              to="/boards"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Back to Your Boards
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
            onClick={() => navigate('/boards')}
            className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Boards
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentBoard.title}
            </h1>
            {currentBoard.private && (
              <div className={`ml-2 p-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Lock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {(isOwner || isCollaborator) && (
              <button
                onClick={() => navigate(`/create-pin?boardId=${boardId}`)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Pin
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <MoreHorizontal className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
              
              {isMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                >
                  <div className="py-1">
                    <button
                      className={`flex items-center px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Board
                    </button>
                    
                    {isOwner && (
                      <>
                        <button
                          className={`flex items-center px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Collaborators
                        </button>
                        
                        <button
                          className={`flex items-center px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Board
                        </button>
                        
                        <button
                          onClick={handleDeleteBoard}
                          className={`flex items-center px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete Board
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {currentBoard.description && (
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentBoard.description}
          </p>
        )}
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center">
            {currentBoard.ownerPhoto ? (
              <img 
                src={currentBoard.ownerPhoto} 
                alt={currentBoard.ownerName} 
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentBoard.ownerName}
            </span>
          </div>
          
          {currentBoard.collaborators && currentBoard.collaborators.length > 0 && (
            <div className="flex items-center">
              <span className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                +{currentBoard.collaborators.length} collaborators
              </span>
            </div>
          )}
        </div>
        
        {currentBoard.tags && currentBoard.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentBoard.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full text-sm`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Search and view options */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Search pins in this board..."
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
          </div>
        </div>
        
        {/* Pins content */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
            {[1, 2, 3, 4].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm ${viewMode === 'grid' ? 'h-64' : 'h-24'} skeleton`}>
              </div>
            ))}
          </div>
        ) : filteredPins.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPins.map(pin => (
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
                    <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pin.title}
                    </h3>
                    {pin.services && pin.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pin.services.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                          >
                            {service}
                          </span>
                        ))}
                        {pin.services.length > 2 && (
                          <span className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                            +{pin.services.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPins.map(pin => (
                <Link
                  key={pin.id}
                  to={`/pin/${pin.id}`}
                  className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm hover:shadow-md transition-shadow p-4`}
                >
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {pin.title}
                    </h3>
                    {pin.description && (
                      <p className={`text-sm line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {pin.description}
                      </p>
                    )}
                    {pin.services && pin.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pin.services.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}
                          >
                            {service}
                          </span>
                        ))}
                        {pin.services.length > 2 && (
                          <span className={`text-xs px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full`}>
                            +{pin.services.length - 2}
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
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">📌</div>
            <h3 className="text-xl font-semibold mb-2">No pins found</h3>
            <p className="mb-6">
              {searchTerm 
                ? "No pins match your search in this board."
                : "This board doesn't have any pins yet."}
            </p>
            {(isOwner || isCollaborator) && (
              <button
                onClick={() => navigate(`/create-pin?boardId=${boardId}`)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Add Your First Pin
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetailPage;