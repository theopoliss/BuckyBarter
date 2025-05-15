import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductItem } from './DATA';

interface ProductCardProps {
  item: ProductItem;
  width: number;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, width, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { width }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.badgeContainer}>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New!</Text>
            </View>
          )}
          
          {item.timeAdded && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>{item.timeAdded}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.title}>{item.title}</Text>
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