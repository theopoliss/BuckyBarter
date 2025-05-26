import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Offer } from '../../MY_LISTINGS'; // Remove old type
import { Timestamp } from 'firebase/firestore'; // Import Timestamp for type checking
import { Offer, getListingById, getUserProfile } from '../../services/firestore'; // Import Firestore Offer type

interface OfferCardProps {
  offer: Offer;
  onPress: (id: string) => void;
}

// Helper to format Firestore Timestamp (can be moved to a utils file)
const formatDate = (timestamp: Timestamp | any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
   if (timestamp && timestamp.seconds) { 
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
  return 'Date not available';
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  const [listingTitle, setListingTitle] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      try {
        // Fetch listing title
        const listing = await getListingById(offer.listingId);
        setListingTitle(listing ? listing.title : 'Unknown Listing');

        // Fetch buyer name
        const buyerProfile = await getUserProfile(offer.buyerUid);
        setBuyerName(buyerProfile ? buyerProfile.displayName || buyerProfile.email : 'Unknown User');

      } catch (error) {
        console.error("Error fetching offer card details:", error);
        setListingTitle('Error loading title');
        setBuyerName('Error loading name');
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [offer.listingId, offer.buyerUid]);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(offer.offerId)} // Use offerId
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isLoadingDetails ? (
          <Text style={styles.loadingText}>Loading offer details...</Text>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>
                Offer from <Text style={styles.highlight}>{buyerName}</Text>
            </Text>
            <Text style={styles.price}>${offer.offerPrice.toFixed(2)}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>for your listing: <Text style={styles.highlight}>{listingTitle}</Text></Text>
            <Text style={styles.timestamp}>Offered on: {formatDate(offer.createdAt)}</Text>
            <View style={[styles.statusBadge, styles[offer.status]]}>
                 <Text style={styles.statusBadgeText}>{offer.status.toUpperCase()}</Text>
            </View>
          </>
        )}
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
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6E6E6E',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  highlight: {
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#D92630',
    marginVertical: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6E6E6E',
    marginTop: 8,
  },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: 'white',
  },
  // Status-specific styles
  pending: { backgroundColor: '#FFB300' }, // Amber
  accepted: { backgroundColor: '#4CAF50' }, // Green
  declined: { backgroundColor: '#F44336' }, // Red
  countered: { backgroundColor: '#2196F3' }, // Blue
  retracted: { backgroundColor: '#9E9E9E' }, // Grey
  expired: { backgroundColor: '#757575' }, // Darker Grey
});

export default OfferCard; 