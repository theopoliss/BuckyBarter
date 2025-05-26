import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { checkSignInLink, completeSignInWithEmailLink, getStoredEmail } from '../services/firebase';

const FinishSignUpScreen = () => {
  const router = useRouter();
  const { loading, error } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const params = useLocalSearchParams<{ link: string, apiKey: string, oobCode: string, mode: string }>();

  // Function to build a Firebase auth link from params
  const buildAuthLink = () => {
    // If we already have a full link, return it
    if (params.link) return params.link;
    
    // If we have oobCode params, construct a Firebase auth link
    if (params.apiKey && params.oobCode && params.mode === 'signIn') {
      const url = new URL('https://buckybarter.firebaseapp.com/__/auth/action');
      url.searchParams.append('apiKey', params.apiKey);
      url.searchParams.append('oobCode', params.oobCode);
      url.searchParams.append('mode', params.mode);
      return url.toString();
    }
    
    return null;
  };

  useEffect(() => {
    async function verifyAndComplete() {
      try {
        const debug: string[] = [];
        debug.push(`Params received: ${JSON.stringify(params)}`);
        
        // Get email from AsyncStorage
        const storedEmail = await getStoredEmail();
        setEmail(storedEmail);
        debug.push(`Stored email: ${storedEmail}`);

        if (!storedEmail) {
          const errorMsg = 'Email not found. Please try signing up again.';
          setVerificationError(errorMsg);
          debug.push(`Error: ${errorMsg}`);
          return;
        }

        // Get the authentication link
        let authLink: string | null = buildAuthLink();
        debug.push(`Built auth link: ${authLink}`);
        
        // If we don't have a link from params, try to get it from initial URL
        if (!authLink) {
          try {
            const initialUrl = await Linking.getInitialURL();
            debug.push(`Initial URL: ${initialUrl}`);
            if (initialUrl) {
              // Use the entire initial URL as the auth link
              authLink = initialUrl;
            }
          } catch (e) {
            const errorMsg = `Error getting initial URL: ${e}`;
            debug.push(errorMsg);
            console.error(errorMsg);
          }
        }

        if (!authLink) {
          const errorMsg = 'Could not extract authentication link from params or deep link.';
          setVerificationError(errorMsg);
          debug.push(`Error: ${errorMsg}`);
          return;
        }

        const isValid = checkSignInLink(authLink);
        debug.push(`Is valid auth link: ${isValid}`);

        if (!isValid) {
          const errorMsg = 'Invalid authentication link. Please try signing up again.';
          setVerificationError(errorMsg);
          debug.push(`Error: ${errorMsg}`);
          return;
        }

        // Complete the sign-in process
        await completeSignInWithEmailLink(storedEmail, authLink);
        debug.push('Sign-in completed successfully');
        
        // Navigate to home page on success
        router.replace('/(tabs)');

      } catch (err: any) {
        const errorMsg = `Authentication error: ${err.message || 'Unknown error'}`;
        console.error(errorMsg);
        setVerificationError(err.message || 'There was a problem signing you in. Please try again.');
        setDebugInfo(errorMsg);
      } finally {
        setVerifying(false);
      }
    }

    verifyAndComplete();
  }, []);

  // Function to display debug alert
  const showDebugInfo = () => {
    if (debugInfo) {
      Alert.alert('Debug Info', debugInfo);
    }
  };

  if (verifying || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Verifying your account...</Text>
      </View>
    );
  }

  const errorMessage = verificationError || error;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      {errorMessage ? (
        <>
          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>
          <Text style={styles.errorDetails} onPress={showDebugInfo}>
            If you're using Expo Go, try opening the app directly on the device 
            where you received the email. For development purposes, you might need 
            to manually copy the authentication code from the email and use it.
            {'\n\n'}
            Tap here for debug info.
          </Text>
        </>
      ) : (
        <Text style={styles.message}>
          Your account has been verified! Redirecting you to the home page...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorDetails: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
});

export default FinishSignUpScreen; 