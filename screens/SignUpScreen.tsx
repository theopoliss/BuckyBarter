import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SignUpScreen = () => {
  const router = useRouter();
  const { sendLoginLink, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);

  const handleContinue = async () => {
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
    
    try {
      const success = await sendLoginLink(email);
      if (success) {
        setLinkSent(true);
        Alert.alert(
          'Link Sent!',
          `We've sent a sign-in link to ${email}. Please check your email and click the link to complete the sign-up process.`
        );
      }
    } catch (err: any) {
      // Error is already set in the auth context
      Alert.alert('Sign-Up Failed', error || 'Please try again with a different email.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleBack = () => {
    router.push('/welcome');
  };

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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: bucky@wisc.edu"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading && !linkSent}
        />
        
        {linkSent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Check your email for a sign-in link to complete the process.
            </Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.resendButtonText}>Resend Link</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.disabledButton]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>Send Sign-In Link</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  continueButtonText: {
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
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;
