import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
// import { CURRENT_USER } from '../../MOCK_USER'; // Remove mock user
import ProfileMenuItem from '../../components/ProfileScreen/ProfileMenuItem';
import StatItem from '../../components/ProfileScreen/StatItem';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth(); // Get user and logout from context
  
  const handleEditProfile = () => {
    console.log('Edit profile pressed');
  };
  
  const handleSettings = () => {
    console.log('Settings pressed');
  };
  
  const handleHelp = () => {
    console.log('Help pressed');
  };

  const handleLogout = async () => { // Make async if logout is async
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
          onPress: async () => {
            try {
              await logout();
              // No need to router.replace here, AuthContext and app/index.tsx will handle the redirect
              console.log('User logged out successfully');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Display loading indicator if auth state is still loading or user is not yet available
  if (authLoading || !user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D92630" />
        <Text style={{ marginTop: 10, fontFamily: 'Inter-Regular' }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Dummy stats if not available on user object directly - replace with actual data source
  const userStats = {
    listings: user?.stats?.listings || 0, // Assuming stats might be part of a fuller user profile object fetched separately
    sold: user?.stats?.sold || 0,
    purchased: user?.stats?.purchased || 0,
  };
  const userJoinedDate = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A';
  const userLocation = user?.location || 'Location not set'; // Assuming location might be on a fetched profile

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: user.photoURL || 'https://via.placeholder.com/100' }} // Use photoURL or a placeholder
            style={styles.profileImage} 
          />
          
          <Text style={styles.userName}>{user.displayName || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user.email || 'Email not available'}</Text>
          <Text style={styles.userLocation}>{userLocation}</Text>
          <Text style={styles.joinedDate}>Member since {userJoinedDate}</Text>
          
          <View style={styles.statsContainer}>
            <StatItem value={userStats.listings} label="Listings" />
            <StatItem value={userStats.sold} label="Sold" />
            <StatItem value={userStats.purchased} label="Purchased" />
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
  centered: { // Added for loading state
    justifyContent: 'center',
    alignItems: 'center',
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