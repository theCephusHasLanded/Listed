import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  X, 
  Check, 
  Bell, 
  User, 
  Heart, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Clock 
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../../store/slices/notificationsSlice';
import { toggleNotifications } from '../../store/slices/uiSlice';
import { Notification } from '../../types';

const NotificationsPanel: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications(user.uid));
    }
  }, [dispatch, user]);
  
  const handleClose = () => {
    dispatch(toggleNotifications());
  };
  
  const handleMarkAllAsRead = () => {
    if (user) {
      dispatch(markAllNotificationsAsRead(user.uid));
    }
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };
  
  const handleDelete = (notificationId: string) => {
    dispatch(deleteNotification(notificationId));
  };
  
  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'follow':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'board-invite':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'booking-request':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'booking-confirmed':
        return <Clock className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div 
            className={`w-screen max-w-md transform transition ease-in-out duration-300 translate-x-0`}
          >
            <div 
              className={`h-full flex flex-col py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 sm:px-6 flex items-center justify-between">
                <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleMarkAllAsRead}
                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Check className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={handleClose}
                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 relative flex-1 px-4 sm:px-6 overflow-y-auto">
                {loading ? (
                  <div className="py-4 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <ul className="space-y-4">
                    {notifications.map((notification: Notification) => (
                      <li 
                        key={notification.id} 
                        className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${!notification.read ? `${darkMode ? 'border-l-4 border-indigo-500' : 'border-l-4 border-indigo-500'}` : ''} rounded-md p-4`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {notification.senderPhoto ? (
                              <img
                                src={notification.senderPhoto}
                                alt={notification.senderName}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                <User className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notification.senderName}
                              </p>
                              <div className="flex items-center">
                                <span className="flex-shrink-0 mr-2">
                                  {getNotificationIcon(notification)}
                                </span>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(notification.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                              {notification.message}
                            </p>
                            
                            <div className="mt-2 flex items-center space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                  Mark as read
                                </button>
                              )}
                              
                              {notification.pinId && (
                                <Link
                                  to={`/pin/${notification.pinId}`}
                                  className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                  View Pin
                                </Link>
                              )}
                              
                              {notification.boardId && (
                                <Link
                                  to={`/board/${notification.boardId}`}
                                  className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800"
                                >
                                  View Board
                                </Link>
                              )}
                              
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-1">No notifications</h3>
                    <p className="text-sm">You don't have any notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;