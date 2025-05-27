import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
// import { Seller } from '../../app/data/MOCK_ITEMS'; // No longer using the mock Seller type directly

interface SellerCardProps {
  // seller: Seller; // Old prop
  name: string;
  avatarUrl?: string;
  location?: string;
  createdAt: string; // This was already a separate prop
}

const SellerCard: React.FC<SellerCardProps> = ({ name, avatarUrl, location, createdAt }) => {
  const defaultAvatar = 'https://via.placeholder.com/56'; // Default placeholder if no avatarUrl
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl || defaultAvatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          Posted {createdAt} {location ? `| ${location}` : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e0e0', // Background for placeholder
  },
  infoContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  details: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6E6E6E',
    marginTop: 2,
  },
});

export default SellerCard; 