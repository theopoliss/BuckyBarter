import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';

// Inner component to consume AuthContext
const AppContent = () => {
  const { authInitialized, loading } = useAuth();

  if (loading || !authInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="finishSignUp" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default function RootLayout() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Wait for Firebase initialization
  useEffect(() => {
    // Check if Firebase Auth is initialized
    if (auth) {
      console.log('Firebase Auth initialized');
      setIsFirebaseReady(true);
    } else {
      console.error('Firebase Auth not initialized');
      // Potentially handle this error more gracefully, e.g., by showing an error message
    }
  }, []);

  // Show loading indicator while Firebase initializes
  if (!isFirebaseReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
