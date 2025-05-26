import { Redirect, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as necessary
 
export default function Index() {
  const { user, loading, authInitialized } = useAuth();

  // Prevent SplashScreen from auto-hiding until we know the auth state
  // In a real app, SplashScreen.preventAutoHideAsync() would be called in _layout.tsx or App.tsx root.
  useEffect(() => {
    if (authInitialized) { // Only hide splash when auth is truly initialized
      SplashScreen.hideAsync();
    }
  }, [authInitialized]);

  // If still loading and auth is not yet initialized, show loading indicator (or rely on native splash)
  if (loading || !authInitialized) { 
    // This view is a fallback if native splash screen is not configured properly or for web.
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
    // If SplashScreen.preventAutoHideAsync() is used effectively in _layout.tsx,
    // you might return null here and let the native splash screen persist.
    // return null;
  }

  // Auth is initialized, now check for user
  if (user) {
    // User is logged in
    // Optional: Check for email verification if required before accessing main app
    // if (!user.emailVerified) {
    //   return <Redirect href="/verify" />;
    // }
    return <Redirect href="/(tabs)" />;
  }

  // User is not logged in and auth is initialized
  return <Redirect href="/welcome" />;
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Or your app's splash screen background color
  },
}); 