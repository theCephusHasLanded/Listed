import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, AlertCircle } from 'lucide-react';
import { RootState } from '../../store';
import { hideConfirmationModal } from '../../store/slices/uiSlice';

const ConfirmationModal: React.FC = () => {
  const { confirmationMessage, confirmationAction, darkMode } = useSelector(
    (state: RootState) => state.ui
  );
  const dispatch = useDispatch();
  
  const handleClose = () => {
    dispatch(hideConfirmationModal());
  };
  
  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    handleClose();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        ></div>
        
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        <div 
          className={`inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
        >
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${darkMode ? 'bg-red-900' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                <AlertCircle className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 
                  className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  id="modal-title"
                >
                  Confirm Action
                </h3>
                <div className="mt-2">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {confirmationMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              type="button"
              className={`mt-3 w-full inline-flex justify-center rounded-md border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;