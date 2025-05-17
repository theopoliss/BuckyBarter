import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Offer } from '../../MY_LISTINGS';

interface OfferCardProps {
  offer: Offer;
  onPress: (id: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(offer.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{offer.buyerName} offered:</Text>
        <Text style={styles.price}>${offer.offerPrice}</Text>
        <Text style={styles.subtitle}>for your {offer.listingTitle}</Text>
        <Text style={styles.timestamp}>{offer.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  content: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#D92630',
    marginVertical: 4,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
    marginTop: 4,
  },
});

export default OfferCard; 