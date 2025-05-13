import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getUserProfile, getUserFollowers, getUserFollows, getUserConnections } from '../../store/slices/profileSlice';
import { User, UserPlus, Users } from 'lucide-react';

const ConnectionsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, follows, followers, connections, loading } = useSelector((state: RootState) => state.profile);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  // Determine if we're viewing the current user's connections or another user's connections
  const isCurrentUser = userId ? userId === user?.uid : true;
  const profileId = userId || user?.uid;
  
  useEffect(() => {
    if (profileId) {
      dispatch(getUserProfile(profileId));
      dispatch(getUserFollows(profileId));
      dispatch(getUserFollowers(profileId));
      dispatch(getUserConnections(profileId));
    }
  }, [dispatch, profileId]);
  
  const [activeTab, setActiveTab] = React.useState<'connections' | 'following' | 'followers'>('connections');
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isCurrentUser ? 'My Network' : `${profile?.displayName || 'User'}'s Network`}
          </h1>
        </div>
        
        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
          <button
            className={`py-4 px-6 font-medium flex items-center ${
              activeTab === 'connections'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('connections')}
          >
            <Users className="w-5 h-5 mr-2" />
            Connections
          </button>
          <button
            className={`py-4 px-6 font-medium flex items-center ${
              activeTab === 'following'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('following')}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Following
          </button>
          <button
            className={`py-4 px-6 font-medium flex items-center ${
              activeTab === 'followers'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('followers')}
          >
            <User className="w-5 h-5 mr-2" />
            Followers
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <div 
                key={idx} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm p-4 skeleton`}>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full h-12 w-12 skeleton"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 skeleton mb-2"></div>
                    <div className="h-3 w-1/2 skeleton"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="mb-6">
              We're currently working on enhancing the connections feature!
            </p>
            <Link 
              to="/search"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              Find Connections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;