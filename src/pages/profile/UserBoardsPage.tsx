import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchUserBoards } from '../../store/slices/boardsSlice';
import { getUserProfile } from '../../store/slices/profileSlice';
import { toggleCreateBoardModal } from '../../store/slices/uiSlice';

const UserBoardsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { boards, loading } = useSelector((state: RootState) => state.boards);
  const { profile } = useSelector((state: RootState) => state.profile);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  // Determine if we're viewing the current user's boards or another user's boards
  const isCurrentUser = userId ? userId === user?.uid : true;
  const profileId = userId || user?.uid;
  
  useEffect(() => {
    if (profileId) {
      dispatch(fetchUserBoards(profileId));
      dispatch(getUserProfile(profileId));
    }
  }, [dispatch, profileId]);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isCurrentUser ? 'My Boards' : `${profile?.displayName || 'User'}'s Boards`}
          </h1>
          
          {isCurrentUser && (
            <button
              onClick={() => dispatch(toggleCreateBoardModal())}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Create Board
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm h-64 skeleton`}>
              </div>
            ))}
          </div>
        ) : boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {boards.map(board => (
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full`}
              >
                <div className="h-48 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500">
                  {board.coverImage && (
                    <img
                      src={board.coverImage}
                      alt={board.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {board.title}
                    </h3>
                    {board.private && (
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        Private
                      </span>
                    )}
                  </div>
                  {board.description && (
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {board.description}
                    </p>
                  )}
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {board.pinCount} pins
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
            <p className="mb-6">
              {isCurrentUser 
                ? "You haven't created any boards yet." 
                : `${profile?.displayName || 'This user'} hasn't created any boards yet.`}
            </p>
            {isCurrentUser && (
              <button
                onClick={() => dispatch(toggleCreateBoardModal())}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Create Your First Board
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBoardsPage;