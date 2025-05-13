import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  startAfter
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { Pin } from '../../types';

interface PinsState {
  pins: Pin[];
  userPins: Pin[];
  savedPins: Pin[];
  currentPin: Pin | null;
  lastVisible: any;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: PinsState = {
  pins: [],
  userPins: [],
  savedPins: [],
  currentPin: null,
  lastVisible: null,
  loading: false,
  error: null,
  hasMore: true,
};

// Fetch pins
export const fetchPins = createAsyncThunk(
  'pins/fetchPins',
  async ({ category, limitCount = 20 }: { category?: string, limitCount?: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pins: PinsState };
      const { lastVisible } = state.pins;
      
      let pinQuery = query(
        collection(db, 'pins'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (category && category !== 'all') {
        pinQuery = query(
          collection(db, 'pins'),
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }
      
      if (lastVisible) {
        pinQuery = query(
          collection(db, 'pins'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(limitCount)
        );
        
        if (category && category !== 'all') {
          pinQuery = query(
            collection(db, 'pins'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(limitCount)
          );
        }
      }
      
      const querySnapshot = await getDocs(pinQuery);
      const pins: Pin[] = [];
      
      querySnapshot.forEach((doc) => {
        pins.push({ id: doc.id, ...doc.data() } as Pin);
      });
      
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.docs.length === limitCount;
      
      return { pins, lastVisible: lastVisibleDoc, hasMore };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pin by ID
export const fetchPinById = createAsyncThunk(
  'pins/fetchPinById',
  async (pinId: string, { rejectWithValue }) => {
    try {
      const pinDoc = await getDoc(doc(db, 'pins', pinId));
      
      if (pinDoc.exists()) {
        const pinData = pinDoc.data() as Pin;
        
        // Increment view count
        await updateDoc(doc(db, 'pins', pinId), {
          viewCount: increment(1)
        });
        
        return { id: pinDoc.id, ...pinData };
      } else {
        return rejectWithValue('Pin not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new pin
export const createPin = createAsyncThunk(
  'pins/createPin',
  async ({ 
    pinData, 
    imageFile 
  }: { 
    pinData: Omit<Pin, 'id' | 'image' | 'saveCount' | 'viewCount' | 'bookingCount'>, 
    imageFile: File 
  }, { rejectWithValue }) => {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `pins/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      // Create pin document in Firestore
      const pinToCreate = {
        ...pinData,
        image: imageUrl,
        saveCount: 0,
        viewCount: 0,
        bookingCount: 0,
        createdAt: Date.now(),
      };
      
      const docRef = await addDoc(collection(db, 'pins'), pinToCreate);
      
      return { id: docRef.id, ...pinToCreate };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a pin
export const deletePin = createAsyncThunk(
  'pins/deletePin',
  async (pinId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pins: PinsState };
      const pin = state.pins.pins.find(p => p.id === pinId) || 
                 state.pins.userPins.find(p => p.id === pinId) || 
                 state.pins.currentPin;
      
      if (!pin) {
        return rejectWithValue('Pin not found');
      }
      
      // Delete image from Firebase Storage
      if (pin.image) {
        const imageRef = ref(storage, pin.image);
        await deleteObject(imageRef);
      }
      
      // Delete pin document from Firestore
      await deleteDoc(doc(db, 'pins', pinId));
      
      return pinId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pins created by a user
export const fetchUserPins = createAsyncThunk(
  'pins/fetchUserPins',
  async (userId: string, { rejectWithValue }) => {
    try {
      const pinsQuery = query(
        collection(db, 'pins'),
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(pinsQuery);
      const pins: Pin[] = [];
      
      querySnapshot.forEach((doc) => {
        pins.push({ id: doc.id, ...doc.data() } as Pin);
      });
      
      return pins;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pins saved by a user
export const fetchSavedPins = createAsyncThunk(
  'pins/fetchSavedPins',
  async (userId: string, { rejectWithValue }) => {
    try {
      const savesQuery = query(
        collection(db, 'saves'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(savesQuery);
      const pinIds: string[] = [];
      
      querySnapshot.forEach((doc) => {
        pinIds.push(doc.data().pinId);
      });
      
      // Fetch the actual pins
      const pins: Pin[] = [];
      
      for (const pinId of pinIds) {
        const pinDoc = await getDoc(doc(db, 'pins', pinId));
        if (pinDoc.exists()) {
          pins.push({ id: pinDoc.id, ...pinDoc.data() } as Pin);
        }
      }
      
      return pins;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const pinsSlice = createSlice({
  name: 'pins',
  initialState,
  reducers: {
    resetPins: (state) => {
      state.pins = [];
      state.lastVisible = null;
      state.hasMore = true;
    },
    setCurrentPin: (state, action: PayloadAction<Pin | null>) => {
      state.currentPin = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pins
      .addCase(fetchPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPins.fulfilled, (state, action) => {
        state.loading = false;
        
        // If we're loading the first page, replace pins
        if (!state.lastVisible) {
          state.pins = action.payload.pins;
        } else {
          // Otherwise, append new pins
          state.pins = [...state.pins, ...action.payload.pins];
        }
        
        state.lastVisible = action.payload.lastVisible;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Pin By ID
      .addCase(fetchPinById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPinById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPin = action.payload as Pin;
      })
      .addCase(fetchPinById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Pin
      .addCase(createPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPin.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = [action.payload, ...state.pins];
        state.userPins = [action.payload, ...state.userPins];
      })
      .addCase(createPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Pin
      .addCase(deletePin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePin.fulfilled, (state, action) => {
        state.loading = false;
        state.pins = state.pins.filter(pin => pin.id !== action.payload);
        state.userPins = state.userPins.filter(pin => pin.id !== action.payload);
        state.savedPins = state.savedPins.filter(pin => pin.id !== action.payload);
        
        if (state.currentPin && state.currentPin.id === action.payload) {
          state.currentPin = null;
        }
      })
      .addCase(deletePin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch User Pins
      .addCase(fetchUserPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPins.fulfilled, (state, action) => {
        state.loading = false;
        state.userPins = action.payload;
      })
      .addCase(fetchUserPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Saved Pins
      .addCase(fetchSavedPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPins.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPins = action.payload;
      })
      .addCase(fetchSavedPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPins, setCurrentPin, clearError } = pinsSlice.actions;
export default pinsSlice.reducer;