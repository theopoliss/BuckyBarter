import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { ProductItem } from './DATA'; // Remove old type
import { Listing } from '../../services/firestore'; // Import Firestore Listing type

interface ProductCardProps {
  item: Listing; // Changed to Listing type
  width: number;
  onPress: () => void;
}

// Basic date/time formatting (could be expanded or use a library like date-fns)
const formatTimeAdded = (timestamp: Timestamp | any): string => {
  try {
    if (timestamp && typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      // Basic relative time, or just date string
      const now = new Date();
      const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
      if (diffSeconds < 60) return 'Just now';
      const diffMinutes = Math.round(diffSeconds / 60);
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.round(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (timestamp && timestamp.seconds) { // Fallback for plain objects
       const date = new Date(timestamp.seconds * 1000);
       const now = new Date();
       const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
       if (diffSeconds < 60) return 'Just now';
       const diffMinutes = Math.round(diffSeconds / 60);
       if (diffMinutes < 60) return `${diffMinutes}m ago`;
       const diffHours = Math.round(diffMinutes / 60);
       if (diffHours < 24) return `${diffHours}h ago`;
       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
  }
  return ''; // Always return a string
};

const ProductCard: React.FC<ProductCardProps> = ({ item, width, onPress }) => {
  // Defensive checks to ensure item has required properties
  if (!item || typeof item !== 'object') {
    return null; // Don't render if item is invalid
  }

  const imageUri = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls[0]
    : 'https://via.placeholder.com/300x300.png?text=No+Image'; // Placeholder

  const isNew = item.condition === 'New';
  const timeAdded = formatTimeAdded(item.createdAt);
  
  // Ensure we have required fields
  const price = typeof item.price === 'number' ? item.price : 0;
  const title = typeof item.title === 'string' ? item.title : 'Untitled';

  return (
    <TouchableOpacity 
      style={[styles.card, { width }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.badgeContainer}>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New!</Text>
            </View>
          )}
          
          {timeAdded && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>{timeAdded}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.8)', // Very subtle gray outline
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0', // Placeholder background
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 5,
  },
  newBadge: {
    width: 40,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DDF8E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#5AC04E',
  },
  timeBadge: {
    minWidth: 50,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  timeBadgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6E6E6E',
  },
  infoContainer: {
    padding: 10,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#505050',
  },
});

export default ProductCard; 