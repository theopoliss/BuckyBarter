import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CURRENT_USER } from '../../MOCK_USER';
import ProfileMenuItem from '../../components/ProfileScreen/ProfileMenuItem';
import StatItem from '../../components/ProfileScreen/StatItem';

export default function ProfileScreen() {
  const router = useRouter();
  const user = CURRENT_USER;
  
  const handleEditProfile = () => {
    console.log('Edit profile pressed');
    // router.push('/edit-profile');
  };
  
  const handleSettings = () => {
    console.log('Settings pressed');
    // router.push('/settings');
  };
  
  const handleHelp = () => {
    console.log('Help pressed');
    // router.push('/help');
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
            // Implement your logout logic here
            // router.replace('/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.profileImage} 
          />
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userLocation}>{user.location}</Text>
          <Text style={styles.joinedDate}>Member since {user.joinedDate}</Text>
          
          <View style={styles.statsContainer}>
            <StatItem value={user.stats.listings} label="Listings" />
            <StatItem value={user.stats.sold} label="Sold" />
            <StatItem value={user.stats.purchased} label="Purchased" />
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <ProfileMenuItem 
            icon="user" 
            title="Edit Profile" 
            onPress={handleEditProfile} 
          />
          <ProfileMenuItem 
            icon="settings" 
            title="Settings" 
            onPress={handleSettings} 
          />
          <ProfileMenuItem 
            icon="help-circle" 
            title="Help & Support" 
            onPress={handleHelp} 
          />
          <ProfileMenuItem 
            icon="log-out" 
            title="Logout" 
            onPress={handleLogout} 
            isDestructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#505050',
    marginBottom: 4,
  },
  userLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#505050',
    marginBottom: 4,
  },
  joinedDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
}); 