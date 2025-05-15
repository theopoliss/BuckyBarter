import { Redirect, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const [shouldNavigate, setShouldNavigate] = useState(false);

  if (shouldNavigate) {
    return <Redirect href={'/(tabs)' as any} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Welcome' }} />
      <Text style={styles.title}>Welcome to BuckyBarter</Text>
      <Text style={styles.subtitle}>Your campus marketplace</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Continue to Home" 
          onPress={() => setShouldNavigate(true)}
          color="#D92630"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  }
}); 