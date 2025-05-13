# Listed - Professional Networking Platform

Listed is a Pinterest-inspired platform designed to connect professionals affected by layoffs, helping them showcase their skills, build networks, and find new opportunities. The platform allows users to create profile pins, organize talent into boards, and connect with other professionals.

## Environment Setup

Create a `.env` file in the root directory with the following Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

> Note: Never commit the `.env` file to version control as it contains sensitive information. The `.env` file is included in the .gitignore file.

## Features

- **User Authentication**: Secure login and registration with Firebase Authentication
- **Profile Management**: Create and customize professional profiles with skills, services, and availability
- **Pins Creation**: Share talents, services, and professional details in a visual Pinterest-like format
- **Boards Organization**: Organize and save professional connections by category, project, or interest
- **Real-time Networking**: Connect with professionals, follow users, and build your network
- **Booking System**: Request services from professionals through an integrated booking system
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Demo Mode**: A special mode to showcase the platform's UX with mock data (/demo route)

## Tech Stack

- **Frontend**: React.js, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/listed.git
   cd listed
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a Firebase project and set up:
   - Authentication (Email/Password and Google sign-in)
   - Firestore Database
   - Storage
   - Hosting

4. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Firebase Emulators (Optional)

For local development, you can use Firebase emulators:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init
   ```

3. Start Firebase emulators:
   ```bash
   firebase emulators:start
   ```

## Deployment

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

## Project Structure

```
listed/
├── public/                  # Public assets
├── src/
│   ├── components/          # React components
│   │   ├── auth/            # Authentication related components
│   │   ├── boards/          # Board management components
│   │   ├── common/          # Shared/common components
│   │   ├── layout/          # Layout components (header, footer)
│   │   ├── pins/            # Pin related components
│   │   └── profile/         # Profile components
│   ├── config/              # Configuration files
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── store/               # Redux store and slices
│   ├── types/               # TypeScript types and interfaces
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   ├── index.tsx            # Entry point
│   └── index.css            # Global CSS
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Framer Motion](https://www.framer.com/motion/)