import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Board, Pin } from '../../types';

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  boardPins: Pin[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  boardPins: [],
  loading: false,
  error: null,
};

// Fetch user's boards
export const fetchUserBoards = createAsyncThunk(
  'boards/fetchUserBoards',
  async (userId: string, { rejectWithValue }) => {
    try {
      const userBoardsQuery = query(
        collection(db, 'boards'),
        where('ownerId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(userBoardsQuery);
      const boards: Board[] = [];
      
      querySnapshot.forEach((doc) => {
        boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      
      // Also fetch boards where user is a collaborator
      const collaboratorBoardsQuery = query(
        collection(db, 'boards'),
        where('collaborators', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const collaboratorSnapshot = await getDocs(collaboratorBoardsQuery);
      
      collaboratorSnapshot.forEach((doc) => {
        boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      
      return boards;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch board by ID and its pins
export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (boardId: string, { rejectWithValue }) => {
    try {
      const boardDoc = await getDoc(doc(db, 'boards', boardId));
      
      if (boardDoc.exists()) {
        const boardData = boardDoc.data() as Board;
        
        // Fetch pins associated with this board
        const pinsQuery = query(
          collection(db, 'pins'),
          where('boardId', '==', boardId),
          orderBy('createdAt', 'desc')
        );
        
        const pinsSnapshot = await getDocs(pinsQuery);
        const pins: Pin[] = [];
        
        pinsSnapshot.forEach((doc) => {
          pins.push({ id: doc.id, ...doc.data() } as Pin);
        });
        
        return {
          board: { id: boardDoc.id, ...boardData },
          pins,
        };
      } else {
        return rejectWithValue('Board not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new board
export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: Omit<Board, 'id' | 'pinCount' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const boardToCreate = {
        ...boardData,
        pinCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const docRef = await addDoc(collection(db, 'boards'), boardToCreate);
      
      return { id: docRef.id, ...boardToCreate };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update board
export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, boardData }: { 
    boardId: string, 
    boardData: Partial<Omit<Board, 'id' | 'ownerId' | 'createdAt' | 'pinCount'>> 
  }, { rejectWithValue }) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      
      await updateDoc(boardRef, {
        ...boardData,
        updatedAt: Date.now(),
      });
      
      const updatedBoard = await getDoc(boardRef);
      
      if (updatedBoard.exists()) {
        return { id: boardId, ...updatedBoard.data() } as Board;
      } else {
        return rejectWithValue('Board not found after update');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete board
export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      // Delete board document
      await deleteDoc(doc(db, 'boards', boardId));
      
      // Find pins associated with this board and remove the boardId reference
      const pinsQuery = query(
        collection(db, 'pins'),
        where('boardId', '==', boardId)
      );
      
      const pinsSnapshot = await getDocs(pinsQuery);
      
      const updatePromises = pinsSnapshot.docs.map(pinDoc => {
        return updateDoc(doc(db, 'pins', pinDoc.id), {
          boardId: null,
        });
      });
      
      await Promise.all(updatePromises);
      
      return boardId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a pin to a board
export const addPinToBoard = createAsyncThunk(
  'boards/addPinToBoard',
  async ({ boardId, pinId }: { boardId: string, pinId: string }, { rejectWithValue }) => {
    try {
      // Update the pin with the boardId
      await updateDoc(doc(db, 'pins', pinId), {
        boardId,
      });
      
      // Increment the board's pinCount
      await updateDoc(doc(db, 'boards', boardId), {
        pinCount: increment(1),
        updatedAt: Date.now(),
      });
      
      // Get the updated pin
      const pinDoc = await getDoc(doc(db, 'pins', pinId));
      
      if (pinDoc.exists()) {
        return { id: pinId, ...pinDoc.data() } as Pin;
      } else {
        return rejectWithValue('Pin not found after adding to board');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a pin from a board
export const removePinFromBoard = createAsyncThunk(
  'boards/removePinFromBoard',
  async ({ boardId, pinId }: { boardId: string, pinId: string }, { rejectWithValue }) => {
    try {
      // Update the pin to remove the boardId
      await updateDoc(doc(db, 'pins', pinId), {
        boardId: null,
      });
      
      // Decrement the board's pinCount
      await updateDoc(doc(db, 'boards', boardId), {
        pinCount: increment(-1),
        updatedAt: Date.now(),
      });
      
      return pinId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a collaborator to a board
export const addCollaborator = createAsyncThunk(
  'boards/addCollaborator',
  async ({ boardId, userId }: { boardId: string, userId: string }, { rejectWithValue }) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      
      await updateDoc(boardRef, {
        collaborators: arrayUnion(userId),
        updatedAt: Date.now(),
      });
      
      const updatedBoard = await getDoc(boardRef);
      
      if (updatedBoard.exists()) {
        return { id: boardId, ...updatedBoard.data() } as Board;
      } else {
        return rejectWithValue('Board not found after adding collaborator');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a collaborator from a board
export const removeCollaborator = createAsyncThunk(
  'boards/removeCollaborator',
  async ({ boardId, userId }: { boardId: string, userId: string }, { rejectWithValue }) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      
      await updateDoc(boardRef, {
        collaborators: arrayRemove(userId),
        updatedAt: Date.now(),
      });
      
      const updatedBoard = await getDoc(boardRef);
      
      if (updatedBoard.exists()) {
        return { id: boardId, ...updatedBoard.data() } as Board;
      } else {
        return rejectWithValue('Board not found after removing collaborator');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Boards
      .addCase(fetchUserBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchUserBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Board By ID
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload.board;
        state.boardPins = action.payload.pins;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = [action.payload, ...state.boards];
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Board
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.map(board => 
          board.id === action.payload.id ? action.payload : board
        );
        
        if (state.currentBoard && state.currentBoard.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.filter(board => board.id !== action.payload);
        
        if (state.currentBoard && state.currentBoard.id === action.payload) {
          state.currentBoard = null;
          state.boardPins = [];
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Pin To Board
      .addCase(addPinToBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPinToBoard.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.currentBoard && action.payload.boardId === state.currentBoard.id) {
          state.boardPins = [action.payload, ...state.boardPins];
        }
        
        // Update the board's pin count in the boards list
        state.boards = state.boards.map(board => 
          board.id === action.payload.boardId 
            ? { ...board, pinCount: board.pinCount + 1 } 
            : board
        );
        
        if (state.currentBoard && state.currentBoard.id === action.payload.boardId) {
          state.currentBoard = {
            ...state.currentBoard,
            pinCount: state.currentBoard.pinCount + 1
          };
        }
      })
      .addCase(addPinToBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove Pin From Board
      .addCase(removePinFromBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePinFromBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boardPins = state.boardPins.filter(pin => pin.id !== action.payload);
        
        // Update the board's pin count
        if (state.currentBoard) {
          state.currentBoard = {
            ...state.currentBoard,
            pinCount: Math.max(0, state.currentBoard.pinCount - 1)
          };
          
          // Also update in the boards list
          state.boards = state.boards.map(board => 
            board.id === state.currentBoard?.id 
              ? { ...board, pinCount: Math.max(0, board.pinCount - 1) } 
              : board
          );
        }
      })
      .addCase(removePinFromBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Collaborator
      .addCase(addCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.map(board => 
          board.id === action.payload.id ? action.payload : board
        );
        
        if (state.currentBoard && state.currentBoard.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove Collaborator
      .addCase(removeCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.map(board => 
          board.id === action.payload.id ? action.payload : board
        );
        
        if (state.currentBoard && state.currentBoard.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      })
      .addCase(removeCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBoard, clearError } = boardsSlice.actions;
export default boardsSlice.reducer;