import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Listing } from '../../services/firestore';

interface ListingCardProps {
  listing: Listing;
  onPress: (id: string) => void;
}

const formatDate = (timestamp: Timestamp | any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
  }
  return 'Date not available';
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {
  const imageUri = listing.imageUrls && listing.imageUrls.length > 0 
    ? listing.imageUrls[0] 
    : 'https://via.placeholder.com/80x80.png?text=No+Image';

  const unreadOffersCount = 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => onPress(listing.listingId)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
          <Text style={styles.price}>${listing.price.toFixed(2)}</Text>
          <Text style={styles.timestamp}>Posted {formatDate(listing.createdAt)}</Text>
        </View>

        {unreadOffersCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadOffersCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 3,
    paddingTop: 8,
    paddingRight: 12,
  },
  card: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  content: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#000',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D92630',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 5,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: 'white',
  },
});

export default ListingCard; 