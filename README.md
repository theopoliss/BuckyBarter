# BuckyBarter

A marketplace app for students to buy and sell items.

## Features

- Authentication with .edu email addresses
- User-friendly UI with a modern design
- Secure login and signup
- Firebase backend integration

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd BuckyBarter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a web app to your Firebase project
3. Enable Authentication in your Firebase project and set up Email/Password authentication
4. Copy your Firebase config values and update them in `constants/firebase.ts`:

```typescript
// constants/firebase.ts
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Run the app

```bash
npm start
```

Then, scan the QR code with the Expo Go app on your mobile device or use an emulator.

## Project Structure

- `app/` - Contains the application routes using expo-router
- `assets/` - Static assets like images and fonts
- `components/` - Reusable UI components
- `constants/` - Configuration constants
- `contexts/` - React contexts for state management
- `screens/` - Main screens of the application
- `services/` - Backend services and API calls

## Authentication Flow

The app uses Firebase Authentication for user management:

1. Users sign up with a .edu email address and password
2. Email format is validated to ensure it ends with .edu
3. Firebase creates the user account
4. Users can log in with their credentials
5. Authentication state is managed throughout the app

## License

[MIT](LICENSE)
