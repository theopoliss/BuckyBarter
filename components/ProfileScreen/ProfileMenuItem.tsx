import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileMenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ 
  icon, 
  title, 
  onPress,
  isDestructive = false
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Feather 
          name={icon} 
          size={20} 
          color={isDestructive ? '#D92630' : '#000'} 
        />
      </View>
      
      <Text style={[
        styles.title,
        isDestructive && styles.destructiveText
      ]}>
        {title}
      </Text>
      
      <Feather name="chevron-right" size={20} color="#9B9B9B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  destructiveText: {
    color: '#D92630',
  },
});

export default ProfileMenuItem; 