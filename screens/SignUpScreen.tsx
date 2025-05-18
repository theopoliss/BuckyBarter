import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Keys for storing form data
const SIGNUP_EMAIL_KEY = '@BuckyBarter:signupEmail';
const SIGNUP_PASSWORD_KEY = '@BuckyBarter:signupPassword';

const SignUpScreen = () => {
  const router = useRouter();
  const { register, sendVerification, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved form data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(SIGNUP_EMAIL_KEY);
        const savedPassword = await AsyncStorage.getItem(SIGNUP_PASSWORD_KEY);
        
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) {
          setPassword(savedPassword);
          setConfirmPassword(savedPassword);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, []);

  // Function to save form data
  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem(SIGNUP_EMAIL_KEY, email);
      await AsyncStorage.setItem(SIGNUP_PASSWORD_KEY, password);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleSignUp = async () => {
    // Clear previous errors
    clearError();
    
    // Basic validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!email.endsWith('.edu')) {
      Alert.alert('Error', 'Please use a .edu email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Save form data before attempting to register
    await saveFormData();
    
    try {
      // Register user with email and password
      const user = await register(email, password);
      
      // Send verification email
      const sent = await sendVerification(user);
      
      if (sent) {
        setVerificationSent(true);
        Alert.alert(
          'Verification Email Sent',
          `We've sent a verification email to ${email}. Please check your inbox and verify your email address to continue.`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/verify')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send verification email. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Sign-Up Failed', error || 'Please try again with a different email or password.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleBack = () => {
    router.push('/welcome');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
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

      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading && !verificationSent}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 8 characters)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading && !verificationSent}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading && !verificationSent}
        />
        
        {verificationSent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Please check your email for a verification link.
            </Text>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => router.replace('/verify')}
            >
              <Text style={styles.verifyButtonText}>Check Verification Status</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginPrompt}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    marginBottom: 40,
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  signUpButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: 'auto',
  },
  loginPrompt: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 8,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;
