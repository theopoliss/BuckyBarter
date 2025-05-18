import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabSwitchProps {
  activeTab: 'listings' | 'offers';
  onTabChange: (tab: 'listings' | 'offers') => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.tabButton,
          activeTab === 'listings' && styles.activeTab
        ]} 
        onPress={() => onTabChange('listings')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'listings' ? styles.activeText : styles.inactiveText
        ]}>
          Your Listings
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.tabButton,
          activeTab === 'offers' && styles.activeTab
        ]} 
        onPress={() => onTabChange('offers')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'offers' ? styles.activeText : styles.inactiveText
        ]}>
          Offers
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 0,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#F0F0F0',
  },
  tabText: {
    fontSize: 14,
  },
  activeText: {
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  inactiveText: {
    fontFamily: 'Inter-Medium',
    color: '#6E6E6E',
  },
});

export default TabSwitch; 