import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryChipProps {
  title: string;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.chipText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
  },
});

export default CategoryChip; 