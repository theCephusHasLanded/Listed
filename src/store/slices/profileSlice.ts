import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  increment,
  Timestamp,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User } from '../../types';

interface ProfileState {
  profile: User | null;
  follows: string[];
  followers: string[];
  connections: User[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  follows: [],
  followers: [],
  connections: [],
  loading: false,
  error: null,
};

// Get user profile by ID
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        return rejectWithValue('User not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ 
    userId, 
    profileData, 
    profileImage 
  }: { 
    userId: string, 
    profileData: Partial<User>, 
    profileImage?: File 
  }, { rejectWithValue }) => {
    try {
      let imageUrl = profileData.photoURL || null;
      
      // If a new image was provided, upload it
      if (profileImage) {
        const storageRef = ref(storage, `users/${userId}/${Date.now()}_profile`);
        const uploadResult = await uploadBytes(storageRef, profileImage);
        imageUrl = await getDownloadURL(uploadResult.ref);
        
        // Delete old image if it exists
        if (profileData.photoURL) {
          try {
            const oldImageRef = ref(storage, profileData.photoURL);
            await deleteObject(oldImageRef);
          } catch (error) {
            // Ignore errors if the old image doesn't exist
            console.error('Error deleting old profile image:', error);
          }
        }
      }
      
      const userRef = doc(db, 'users', userId);
      
      const updatedData = {
        ...profileData,
        photoURL: imageUrl,
        lastActive: Date.now(),
      };
      
      await updateDoc(userRef, updatedData);
      
      // Update auth profile if needed
      if (auth.currentUser && (profileData.displayName || imageUrl)) {
        const updates: {
          displayName?: string;
          photoURL?: string | null;
        } = {};
        
        if (profileData.displayName) {
          updates.displayName = profileData.displayName;
        }
        
        if (imageUrl !== undefined) {
          updates.photoURL = imageUrl;
        }
        
        await updateProfile(auth.currentUser, updates);
      }
      
      const updatedUser = await getDoc(userRef);
      
      if (updatedUser.exists()) {
        return updatedUser.data() as User;
      } else {
        return rejectWithValue('User not found after update');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user follows
export const getUserFollows = createAsyncThunk(
  'profile/getUserFollows',
  async (userId: string, { rejectWithValue }) => {
    try {
      const followsQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId)
      );
      
      const querySnapshot = await getDocs(followsQuery);
      const follows: string[] = [];
      
      querySnapshot.forEach((doc) => {
        follows.push(doc.data().followingId);
      });
      
      return follows;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user followers
export const getUserFollowers = createAsyncThunk(
  'profile/getUserFollowers',
  async (userId: string, { rejectWithValue }) => {
    try {
      const followersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', userId)
      );
      
      const querySnapshot = await getDocs(followersQuery);
      const followers: string[] = [];
      
      querySnapshot.forEach((doc) => {
        followers.push(doc.data().followerId);
      });
      
      return followers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Follow a user
export const followUser = createAsyncThunk(
  'profile/followUser',
  async ({ 
    currentUserId, 
    targetUserId 
  }: { 
    currentUserId: string, 
    targetUserId: string 
  }, { rejectWithValue }) => {
    try {
      // Add follow relationship
      await setDoc(doc(db, 'follows', `${currentUserId}_${targetUserId}`), {
        followerId: currentUserId,
        followingId: targetUserId,
        createdAt: Date.now(),
      });
      
      // Update connections count
      await updateDoc(doc(db, 'users', currentUserId), {
        connectionsCount: increment(1),
      });
      
      await updateDoc(doc(db, 'users', targetUserId), {
        connectionsCount: increment(1),
      });
      
      // Create notification
      const currentUser = await getDoc(doc(db, 'users', currentUserId));
      
      if (currentUser.exists()) {
        const userData = currentUser.data() as User;
        
        await addDoc(collection(db, 'notifications'), {
          recipientId: targetUserId,
          senderId: currentUserId,
          senderName: userData.displayName,
          senderPhoto: userData.photoURL,
          type: 'follow',
          message: `${userData.displayName} started following you`,
          read: false,
          createdAt: Date.now(),
        });
      }
      
      return targetUserId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Unfollow a user
export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async ({ 
    currentUserId, 
    targetUserId 
  }: { 
    currentUserId: string, 
    targetUserId: string 
  }, { rejectWithValue }) => {
    try {
      // Remove follow relationship
      await deleteDoc(doc(db, 'follows', `${currentUserId}_${targetUserId}`));
      
      // Update connections count
      await updateDoc(doc(db, 'users', currentUserId), {
        connectionsCount: increment(-1),
      });
      
      await updateDoc(doc(db, 'users', targetUserId), {
        connectionsCount: increment(-1),
      });
      
      return targetUserId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user connections (people user follows who also follow the user)
export const getUserConnections = createAsyncThunk(
  'profile/getUserConnections',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { follows, followers } = state.profile;
      
      // Find the intersection of follows and followers (mutual connections)
      const connections = follows.filter(id => followers.includes(id));
      
      // Fetch user data for each connection
      const users: User[] = [];
      
      for (const connectionId of connections) {
        const userDoc = await getDoc(doc(db, 'users', connectionId));
        
        if (userDoc.exists()) {
          users.push(userDoc.data() as User);
        }
      }
      
      return users;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get User Follows
      .addCase(getUserFollows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollows.fulfilled, (state, action) => {
        state.loading = false;
        state.follows = action.payload;
      })
      .addCase(getUserFollows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get User Followers
      .addCase(getUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(getUserFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Follow User
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.follows = [...state.follows, action.payload];
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Unfollow User
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.follows = state.follows.filter(id => id !== action.payload);
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get User Connections
      .addCase(getUserConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
      })
      .addCase(getUserConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;