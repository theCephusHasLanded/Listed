import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  MessageSquare, 
  Check, 
  Loader 
} from 'lucide-react';
import { toggleBookingModal } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';
import { Pin, User as UserType } from '../../types';
import { doc, addDoc, collection, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Helper component for date picker
const DatePicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
  darkMode: boolean;
}> = ({ selectedDate, onChange, darkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Get days in current month
  const days = getDaysInMonth(currentMonth);
  
  // Get month name
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  // Get current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return (
    <div className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="font-semibold">
          {monthName} {currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Add empty cells for days of the week before the first day of the month */}
        {Array(days[0].getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="h-8"></div>
          ))}
        
        {days.map(day => {
          const isToday = day.getTime() === today.getTime();
          const isSelected = 
            day.getDate() === selectedDate.getDate() && 
            day.getMonth() === selectedDate.getMonth() && 
            day.getFullYear() === selectedDate.getFullYear();
          const isPast = day < today;
          
          return (
            <button
              key={day.toString()}
              type="button"
              disabled={isPast}
              onClick={() => onChange(day)}
              className={`
                h-8 w-full rounded-full flex items-center justify-center text-sm
                ${isSelected 
                  ? 'bg-indigo-600 text-white' 
                  : isToday
                  ? `${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'}`
                }
                ${isPast ? `opacity-50 cursor-not-allowed ${darkMode ? 'text-gray-600' : 'text-gray-400'}` : ''}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Helper component for time slots
const TimeSlots: React.FC<{
  selectedTime: string;
  onChange: (time: string) => void;
  darkMode: boolean;
}> = ({ selectedTime, onChange, darkMode }) => {
  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${hourFormatted}:00 ${amPm}`);
      slots.push(`${hourFormatted}:30 ${amPm}`);
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {timeSlots.map(time => (
        <button
          key={time}
          type="button"
          onClick={() => onChange(time)}
          className={`
            py-2 px-3 text-sm rounded-md
            ${selectedTime === time 
              ? 'bg-indigo-600 text-white' 
              : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
            }
          `}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

// Main booking modal component
const BookingModal: React.FC = () => {
  const { isBookingModalOpen, darkMode } = useSelector((state: RootState) => state.ui);
  const { currentPin } = useSelector((state: RootState) => state.pins);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [service, setService] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when modal opens with new pin
  useEffect(() => {
    if (isBookingModalOpen && currentPin) {
      setSelectedDate(new Date());
      setSelectedTime('10:00 AM');
      setService(currentPin.services && currentPin.services.length > 0 ? currentPin.services[0] : '');
      setDuration(1);
      setNotes('');
      setSuccess(false);
      setError(null);
    }
  }, [isBookingModalOpen, currentPin]);
  
  const handleClose = () => {
    dispatch(toggleBookingModal());
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !currentPin) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Parse date and time
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      let hour = parseInt(hours, 10);
      
      if (isPM && hour !== 12) {
        hour += 12;
      } else if (!isPM && hour === 12) {
        hour = 0;
      }
      
      const minute = parseInt(minutes.split(' ')[0], 10);
      
      // Set the hours and minutes to the selected date
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(hour, minute, 0, 0);
      
      // Get provider details
      const providerDoc = await getDoc(doc(db, 'users', currentPin.ownerId));
      const providerData = providerDoc.exists() ? providerDoc.data() as UserType : null;
      
      // Create booking in Firestore
      await addDoc(collection(db, 'bookings'), {
        clientId: user.uid,
        clientName: user.displayName || 'User',
        providerId: currentPin.ownerId,
        providerName: currentPin.ownerName,
        providerPhoto: providerData?.photoURL || currentPin.ownerPhoto,
        pinId: currentPin.id,
        service: service || 'Consultation',
        rate: currentPin.rate || 'Contact for pricing',
        status: 'pending',
        date: bookingDate.getTime(),
        duration: duration * 60, // Convert hours to minutes
        notes: notes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      // Also create a notification for the provider
      await addDoc(collection(db, 'notifications'), {
        recipientId: currentPin.ownerId,
        senderId: user.uid,
        senderName: user.displayName || 'User',
        senderPhoto: user.photoURL,
        type: 'booking-request',
        pinId: currentPin.id,
        message: `${user.displayName || 'Someone'} requested to book your services`,
        read: false,
        createdAt: Date.now(),
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Close modal after 3 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
      setLoading(false);
    }
  };
  
  if (!isBookingModalOpen || !currentPin) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className={`inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 
                className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                id="modal-headline"
              >
                Book {currentPin.ownerName}
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Booking Request Sent!
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You'll be notified when {currentPin.ownerName} responds to your request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className={`mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      <label className="block text-sm font-medium mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Select Date
                      </label>
                      <DatePicker 
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        darkMode={darkMode}
                      />
                    </div>
                    
                    <div className={`mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      <label className="block text-sm font-medium mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Time
                      </label>
                      <TimeSlots 
                        selectedTime={selectedTime}
                        onChange={setSelectedTime}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <User className="w-4 h-4 inline mr-2" />
                        Service
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } border`}
                        required
                      >
                        {currentPin.services ? (
                          currentPin.services.map((svc, idx) => (
                            <option key={idx} value={svc}>{svc}</option>
                          ))
                        ) : (
                          <option value="Consultation">Consultation</option>
                        )}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <Clock className="w-4 h-4 inline mr-2" />
                        Duration (hours)
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                        className={`w-full px-3 py-2 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } border`}
                      >
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hours</option>
                        <option value={3}>3 hours</option>
                        <option value={4}>4 hours</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Rate
                      </label>
                      <div className={`py-2 px-3 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {currentPin.rate || 'Contact for pricing'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any details or questions about the booking..."
                    rows={3}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border`}
                  ></textarea>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Booking Request'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } shadow-sm px-4 py-2 bg-transparent focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;