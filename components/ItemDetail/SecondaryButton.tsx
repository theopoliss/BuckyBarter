import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F0F0',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 0,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default SecondaryButton; 