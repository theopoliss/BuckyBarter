import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D92630',
  },
  buttonText: {
    color: '#D92630',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

export default SecondaryButton; 