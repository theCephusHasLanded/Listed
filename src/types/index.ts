export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  profession?: string;
  location?: string;
  website?: string;
  skills?: string[];
  availability?: string;
  hourlyRate?: string;
  verified?: boolean;
  createdAt: number;
  lastActive: number;
  boardCount?: number;
  pinCount?: number;
  connectionsCount?: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  private: boolean;
  ownerId: string;
  ownerName: string;
  ownerPhoto?: string;
  collaborators?: string[];
  pinCount: number;
  createdAt: number;
  updatedAt: number;
  category?: string;
  tags?: string[];
}

export interface Pin {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhoto?: string;
  boardId?: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  tags?: string[];
  category?: string;
  services?: string[];
  rate?: string;
  location?: string;
  availability?: string;
  rating?: number;
  saveCount: number;
  viewCount: number;
  bookingCount: number;
  createdAt: number;
}

export interface Comment {
  id: string;
  pinId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  type: 'like' | 'comment' | 'follow' | 'board-invite' | 'booking-request' | 'booking-confirmed';
  pinId?: string;
  boardId?: string;
  commentId?: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  providerPhoto?: string;
  pinId?: string;
  service: string;
  rate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: number;
  duration: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type FilterCategory = 'all' | 'tech' | 'design' | 'marketing' | 'finance' | 'leadership' | string;