import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Seller } from '../../app/data/MOCK_ITEMS';

interface SellerCardProps {
  seller: Seller;
  createdAt: string;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, createdAt }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: seller.avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{seller.name}</Text>
        <Text style={styles.details}>Posted {createdAt} | {seller.location}</Text>
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