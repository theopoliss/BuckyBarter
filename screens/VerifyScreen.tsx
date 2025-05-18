import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const VerifyScreen = () => {
  const router = useRouter();
  const { user, loading, sendVerification } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    // If the user has verified their email, redirect to home
    if (user?.emailVerified) {
      router.replace('/home');
    }
  }, [user, router]);

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    setCheckingStatus(true);
    
    try {
      // Reload the user to check verification status
      await user.reload();
      
      if (user.emailVerified) {
        Alert.alert(
          'Email Verified!',
          'Your email has been verified successfully. You can now continue to the app.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/home')
            }
          ]
        );
      } else {
        Alert.alert(
          'Not Verified',
          'Your email is not verified yet. Please check your inbox and click the verification link.',
          [
            {
              text: 'OK',
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      Alert.alert('Error', 'Failed to check verification status. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const resendVerification = async () => {
    if (!user) return;
    
    setCheckingStatus(true);
    
    try {
      // Send another verification email using the context function
      const sent = await sendVerification(user);
      if (sent) {
        Alert.alert(
          'Verification Email Sent',
          'A new verification email has been sent to your email address.'
        );
      } else {
        Alert.alert('Error', 'Failed to send verification email. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      Alert.alert('Error', 'Failed to send verification email. Please try again later.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleBack = () => {
    // Navigate back to signup page without clearing the stored form data
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verification Required</Text>
        <Text style={styles.message}>
          You need to be logged in to verify your email. Please log in to continue.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/buckybarter-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>BuckyBarter</Text>
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      
      <Text style={styles.message}>
        We've sent a verification email to {user.email}.
        Please check your inbox and click the verification link.
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, checkingStatus && styles.disabledButton]}
          onPress={checkVerificationStatus}
          disabled={checkingStatus}
        >
          {checkingStatus ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check Verification Status</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.outlineButton, checkingStatus && styles.disabledOutlineButton]}
          onPress={resendVerification}
          disabled={checkingStatus}
        >
          <Text style={styles.outlineButtonText}>Resend Verification Email</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: -10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  outlineButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledOutlineButton: {
    borderColor: '#999',
  },
  loginButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VerifyScreen; 