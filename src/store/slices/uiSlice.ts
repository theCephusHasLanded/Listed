import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterCategory } from '../../types';

interface UIState {
  searchTerm: string;
  selectedFilter: FilterCategory;
  isCreatePinModalOpen: boolean;
  isCreateBoardModalOpen: boolean;
  isBookingModalOpen: boolean;
  isShareModalOpen: boolean;
  isNotificationsOpen: boolean;
  isEditProfileModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  confirmationMessage: string;
  confirmationAction: (() => void) | null;
  isMobileMenuOpen: boolean;
  darkMode: boolean;
}

const initialState: UIState = {
  searchTerm: '',
  selectedFilter: 'all',
  isCreatePinModalOpen: false,
  isCreateBoardModalOpen: false,
  isBookingModalOpen: false,
  isShareModalOpen: false,
  isNotificationsOpen: false,
  isEditProfileModalOpen: false,
  isConfirmationModalOpen: false,
  confirmationMessage: '',
  confirmationAction: null,
  isMobileMenuOpen: false,
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<FilterCategory>) => {
      state.selectedFilter = action.payload;
    },
    toggleCreatePinModal: (state) => {
      state.isCreatePinModalOpen = !state.isCreatePinModalOpen;
    },
    toggleCreateBoardModal: (state) => {
      state.isCreateBoardModalOpen = !state.isCreateBoardModalOpen;
    },
    toggleBookingModal: (state) => {
      state.isBookingModalOpen = !state.isBookingModalOpen;
    },
    toggleShareModal: (state) => {
      state.isShareModalOpen = !state.isShareModalOpen;
    },
    toggleNotifications: (state) => {
      state.isNotificationsOpen = !state.isNotificationsOpen;
    },
    toggleEditProfileModal: (state) => {
      state.isEditProfileModalOpen = !state.isEditProfileModalOpen;
    },
    showConfirmationModal: (state, action: PayloadAction<{ message: string, action: (() => void) | null }>) => {
      state.isConfirmationModalOpen = true;
      state.confirmationMessage = action.payload.message;
      state.confirmationAction = action.payload.action;
    },
    hideConfirmationModal: (state) => {
      state.isConfirmationModalOpen = false;
      state.confirmationMessage = '';
      state.confirmationAction = null;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    resetUIState: () => initialState,
  },
});

export const {
  setSearchTerm,
  setSelectedFilter,
  toggleCreatePinModal,
  toggleCreateBoardModal,
  toggleBookingModal,
  toggleShareModal,
  toggleNotifications,
  toggleEditProfileModal,
  showConfirmationModal,
  hideConfirmationModal,
  toggleMobileMenu,
  toggleDarkMode,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;