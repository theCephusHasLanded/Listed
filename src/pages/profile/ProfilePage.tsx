import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Globe, 
  Mail, 
  Edit, 
  UserPlus, 
  UserMinus, 
  Grid, 
  Bookmark,
  Users,
  Settings
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { getUserProfile } from '../../store/slices/profileSlice';
import { fetchUserPins } from '../../store/slices/pinsSlice';
import { fetchUserBoards } from '../../store/slices/boardsSlice';
import { toggleEditProfileModal } from '../../store/slices/uiSlice';
import { followUser, unfollowUser } from '../../store/slices/profileSlice';
import { Pin } from '../../types';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, follows, loading: profileLoading } = useSelector((state: RootState) => state.profile);
  const { userPins, loading: pinsLoading } = useSelector((state: RootState) => state.pins);
  const { boards, loading: boardsLoading } = useSelector((state: RootState) => state.boards);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pins' | 'boards' | 'connections'>('pins');
  
  // Determine if we're viewing the current user's profile or another user's profile
  const isCurrentUser = userId ? userId === user?.uid : true;
  const profileId = userId || user?.uid;
  
  // Check if current user follows this profile
  const isFollowing = follows.includes(profileId || '');
  
  useEffect(() => {
    if (profileId) {
      dispatch(getUserProfile(profileId));
      dispatch(fetchUserPins(profileId));
      dispatch(fetchUserBoards(profileId));
    }
  }, [dispatch, profileId]);
  
  const handleFollow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (profileId) {
      if (isFollowing) {
        dispatch(unfollowUser({ currentUserId: user.uid, targetUserId: profileId }));
      } else {
        dispatch(followUser({ currentUserId: user.uid, targetUserId: profileId }));
      }
    }
  };
  
  const handleEditProfile = () => {
    dispatch(toggleEditProfileModal());
  };
  
  // Loading state
  if (profileLoading && !profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full skeleton"></div>
          <div className="mt-6 w-60 h-8 skeleton"></div>
          <div className="mt-2 w-40 h-6 skeleton"></div>
          <div className="mt-8 w-full max-w-3xl h-24 skeleton"></div>
          <div className="mt-8 flex space-x-4">
            <div className="w-32 h-10 skeleton"></div>
            <div className="w-32 h-10 skeleton"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // No profile found
  if (!profile && !profileLoading) {
    return (
      <div className={`max-w-6xl mx-auto px-4 py-12 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
        <p className="mb-6">The user you're looking for doesn't exist or isn't available.</p>
        <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Cover Image */}
      <div className="h-64 w-full bg-gradient-to-r from-indigo-600 to-purple-600 relative">
        {/* Add custom cover image here if available */}
      </div>
      
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 md:p-8`}>
          <div className="flex flex-col md:flex-row items-start md:items-end">
            {/* Profile Image */}
            <div className="flex-shrink-0 -mt-24 md:-mt-24 mb-4 md:mb-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                {profile?.photoURL ? (
                  <img 
                    src={profile.photoURL} 
                    alt={profile.displayName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-3xl font-bold ${darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info & Actions */}
            <div className="flex-grow md:ml-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.displayName || user?.displayName || 'User'}
                  </h1>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profile?.profession || 'Professional'}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                  {isCurrentUser ? (
                    <>
                      <button 
                        onClick={handleEditProfile}
                        className={`flex items-center px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                      <Link 
                        to="/profile/settings" 
                        className={`flex items-center px-4 py-2 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-full`}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleFollow}
                        className={`flex items-center px-4 py-2 ${
                          isFollowing 
                            ? `border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } rounded-full`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </button>
                      <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="text-center">
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userPins.length}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pins</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {boards.length}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Boards</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.connectionsCount || 0}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Connections</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio & Details */}
          <div className="mt-8">
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>{profile?.bio || 'No bio available.'}</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.location && (
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.profession && (
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{profile.profession}</span>
                </div>
              )}
              {profile?.availability && (
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Available: {profile.availability}</span>
                </div>
              )}
              {profile?.hourlyRate && (
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>{profile.hourlyRate}</span>
                </div>
              )}
              {profile?.website && (
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Globe className="w-5 h-5 mr-2" />
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
            
            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full text-sm`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={`py-4 px-6 font-medium flex items-center ${
              activeTab === 'pins'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('pins')}
          >
            <Grid className="w-5 h-5 mr-2" />
            Pins
          </button>
          <button
            className={`py-4 px-6 font-medium flex items-center ${
              activeTab === 'boards'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('boards')}
          >
            <Bookmark className="w-5 h-5 mr-2" />
            Boards
          </button>
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
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Pins tab */}
        {activeTab === 'pins' && (
          <>
            {pinsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm h-64 skeleton`}></div>
                ))}
              </div>
            ) : userPins.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userPins.map((pin: Pin) => (
                  <Link
                    key={pin.id}
                    to={`/pin/${pin.id}`}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={pin.image}
                        alt={pin.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {pin.title}
                      </h3>
                      {pin.description && (
                        <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pin.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {pin.saveCount} saves
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {new Date(pin.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-5xl mb-4">📌</div>
                <h3 className="text-xl font-semibold mb-2">No pins yet</h3>
                <p className="mb-6">This profile hasn't created any pins.</p>
                {isCurrentUser && (
                  <button 
                    onClick={() => navigate('/create-pin')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    Create Your First Pin
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Boards tab */}
        {activeTab === 'boards' && (
          <>
            {boardsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                  <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm h-64 skeleton`}></div>
                ))}
              </div>
            ) : boards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {boards.map(board => (
                  <Link
                    key={board.id}
                    to={`/board/${board.id}`}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col`}
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
                    <div className="p-4 flex-grow">
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
                        <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {board.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {board.pinCount} pins
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {new Date(board.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
                <p className="mb-6">This profile hasn't created any boards.</p>
                {isCurrentUser && (
                  <button 
                    onClick={() => navigate('/boards')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    Create Your First Board
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Connections tab */}
        {activeTab === 'connections' && (
          <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Connections</h3>
            <p className="mb-6">This feature is coming soon!</p>
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

export default ProfilePage;