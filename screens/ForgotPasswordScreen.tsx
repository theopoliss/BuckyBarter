import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { sendPasswordReset, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    // Clear previous errors
    clearError();
    
    // Basic validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    try {
      await sendPasswordReset(email);
      setResetSent(true);
      Alert.alert(
        'Reset Email Sent',
        `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions to reset your password.`
      );
    } catch (err: any) {
      Alert.alert('Reset Failed', error || 'Failed to send password reset email. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleBack = () => {
    router.back();
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

      <Text style={styles.title}>Reset Password</Text>

      {resetSent ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Password reset email sent. Check your email for instructions to reset your password.
          </Text>
          <TouchableOpacity
            style={styles.successLoginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.instructions}>
            Enter your email address below and we'll send you a link to reset your password.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 24,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
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
  resetButton: {
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
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  successLoginButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
});

export default ForgotPasswordScreen; 