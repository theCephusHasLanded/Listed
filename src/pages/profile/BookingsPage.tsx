import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Clock, DollarSign, MapPin, User, Check, X, MessageSquare } from 'lucide-react';
import { RootState } from '../../store';

const BookingsPage: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
  
  // Mock bookings data
  const upcomingBookings = [
    {
      id: '1',
      clientName: 'Jason Miller',
      clientPhoto: null,
      service: 'UX Design Consultation',
      date: new Date('2025-06-01T14:00:00'),
      duration: 60,
      rate: '$150/hr',
      status: 'confirmed',
      notes: 'Discussing redesign of dashboard interface',
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      clientPhoto: null,
      service: 'Website Audit',
      date: new Date('2025-05-28T10:30:00'),
      duration: 90,
      rate: '$150/hr',
      status: 'confirmed',
      notes: 'Comprehensive audit of e-commerce website',
    },
  ];
  
  const pendingBookings = [
    {
      id: '3',
      clientName: 'Michael Brown',
      clientPhoto: null,
      service: 'Design System Creation',
      date: new Date('2025-06-05T15:00:00'),
      duration: 120,
      rate: '$150/hr',
      status: 'pending',
      notes: 'Setting up a complete design system for mobile app',
    },
  ];
  
  const pastBookings = [
    {
      id: '4',
      clientName: 'Lisa Wong',
      clientPhoto: null,
      service: 'UX Research',
      date: new Date('2025-05-10T09:00:00'),
      duration: 60,
      rate: '$150/hr',
      status: 'completed',
      notes: 'User research for new product feature',
    },
    {
      id: '5',
      clientName: 'David Chen',
      clientPhoto: null,
      service: 'Website Redesign',
      date: new Date('2025-05-05T13:00:00'),
      duration: 90,
      rate: '$150/hr',
      status: 'completed',
      notes: 'Complete redesign of company website',
    },
  ];
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    }
    
    if (mins === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
  };
  
  const renderBookingsList = (bookings: any[]) => {
    if (bookings.length === 0) {
      return (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">No bookings</h3>
          <p>You don't have any {activeTab} bookings.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {bookings.map(booking => (
          <div 
            key={booking.id} 
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {booking.service}
                </h3>
                <div className="flex items-center mt-1">
                  <div className="w-6 h-6 rounded-full mr-2 overflow-hidden bg-indigo-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {booking.clientName}
                  </span>
                </div>
              </div>
              
              {booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </button>
                </div>
              )}
              
              {booking.status === 'confirmed' && (
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm">
                    Confirmed
                  </span>
                </div>
              )}
              
              {booking.status === 'completed' && (
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm">
                    Completed
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{formatDuration(booking.duration)}</span>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                <span>{booking.rate}</span>
              </div>
            </div>
            
            {booking.notes && (
              <div className={`mt-4 p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md`}>
                <div className="flex items-start">
                  <MessageSquare className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0 mt-0.5`} />
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Bookings
        </h1>
        
        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'upcoming'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'pending'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'past'
                ? `${darkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'} border-b-2`
                : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>
        
        {/* Bookings List */}
        {activeTab === 'upcoming' && renderBookingsList(upcomingBookings)}
        {activeTab === 'pending' && renderBookingsList(pendingBookings)}
        {activeTab === 'past' && renderBookingsList(pastBookings)}
      </div>
    </div>
  );
};

export default BookingsPage;