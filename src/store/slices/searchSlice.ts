import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  recentSearches: string[];
  searchResults: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  recentSearches: [],
  searchResults: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload.trim();
      if (search && !state.recentSearches.includes(search)) {
        state.recentSearches = [search, ...state.recentSearches.slice(0, 9)];
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        (search) => search !== action.payload
      );
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  setSearchResults,
  setSearchLoading,
  setSearchError,
} = searchSlice.actions;

export default searchSlice.reducer;