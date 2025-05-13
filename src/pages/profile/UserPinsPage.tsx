import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchUserPins } from '../../store/slices/pinsSlice';
import { getUserProfile } from '../../store/slices/profileSlice';

const UserPinsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userPins, loading } = useSelector((state: RootState) => state.pins);
  const { profile } = useSelector((state: RootState) => state.profile);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  // Determine if we're viewing the current user's pins or another user's pins
  const isCurrentUser = userId ? userId === user?.uid : true;
  const profileId = userId || user?.uid;
  
  useEffect(() => {
    if (profileId) {
      dispatch(fetchUserPins(profileId));
      dispatch(getUserProfile(profileId));
    }
  }, [dispatch, profileId]);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isCurrentUser ? 'My Pins' : `${profile?.displayName || 'User'}'s Pins`}
          </h1>
          
          {isCurrentUser && (
            <Link
              to="/create-pin"
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Create Pin
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm h-64 skeleton`}>
              </div>
            ))}
          </div>
        ) : userPins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userPins.map(pin => (
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
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pin.description || 'No description'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">📌</div>
            <h3 className="text-xl font-semibold mb-2">No pins yet</h3>
            <p className="mb-6">
              {isCurrentUser 
                ? "You haven't created any pins yet." 
                : `${profile?.displayName || 'This user'} hasn't created any pins yet.`}
            </p>
            {isCurrentUser && (
              <Link
                to="/create-pin"
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Create Your First Pin
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPinsPage;