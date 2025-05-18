import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type FilterType = 'all' | 'buying' | 'selling';

interface FilterTabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#F0F0F0',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6E6E6E',
  },
  activeText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
});

export default FilterTab; 