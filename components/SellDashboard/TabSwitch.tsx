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
        style={styles.tabButton} 
        onPress={() => onTabChange('listings')}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'listings' ? styles.activeText : styles.inactiveText
        ]}>
          Your Listings
        </Text>
        {activeTab === 'listings' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => onTabChange('offers')}
      >
        <Text style={[
          styles.tabText, 
          activeTab === 'offers' ? styles.activeText : styles.inactiveText
        ]}>
          Offers
        </Text>
        {activeTab === 'offers' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    marginRight: 40,
    paddingBottom: 10,
    position: 'relative',
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  activeText: {
    color: '#000',
  },
  inactiveText: {
    color: '#9B9B9B',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
});

export default TabSwitch; 