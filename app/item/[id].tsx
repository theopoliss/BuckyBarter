import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore'; // For type checking and conversion
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ImageCarousel from '../../components/ItemDetail/ImageCarousel';
import PrimaryButton from '../../components/ItemDetail/PrimaryButton';
import SecondaryButton from '../../components/ItemDetail/SecondaryButton';
import SellerCard from '../../components/ItemDetail/SellerCard';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { Listing, UserProfile, getListingById, getOrCreateConversation, getUserProfile } from '../../services/firestore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#D92630',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? (StatusBar.currentHeight || 0) + 50 : (StatusBar.currentHeight || 0) + 20,
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 24,
  },
  descriptionHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 20,
    color: '#000',
    marginBottom: 16,
  },
  conditionHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    marginTop: 0,
  },
  conditionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
});

const formatDate = (timestamp: Timestamp | undefined | null): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString(); 
  }
  return 'Date not available';
};

const getConditionColor = (condition: Listing['condition']): string => {
  switch (condition) {
    case 'New':
      return '#28A745'; // Green
    case 'Like New':
      return '#20C997'; // Tealish Green
    case 'Good':
      return '#007BFF'; // Blue
    case 'Fair':
      return '#FD7E14'; // Orange
    case 'Poor':
      return '#DC3545'; // Red
    default:
      return '#555'; // Default color
  }
};

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser, loading: authLoading } = useAuth(); // Get currentUser from useAuth
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false); // For loading state on button press

  // Determine if the current user is the seller
  const currentUserId = currentUser?.uid;
  const isCurrentUserTheSeller = listing?.sellerUid === currentUserId;

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const listingData = await getListingById(id);
          if (listingData) {
            setListing(listingData);
            if (listingData.sellerUid) {
              const sellerData = await getUserProfile(listingData.sellerUid);
              setSeller(sellerData);
            } else {
              console.warn("Listing has no sellerUid:", listingData.listingId);
            }
          } else {
            setError('Item not found. It might have been removed or the link is incorrect.');
          }
        } catch (e: any) {
          console.error("Error fetching item details:", e);
          setError(e.message || 'Failed to load item details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else {
      setError("No item ID provided.");
      setIsLoading(false);
    }
  }, [id]);

  const handleMessageSeller = async () => {
    if (!listing || !listing.sellerUid || !currentUserId || isCurrentUserTheSeller) {
      console.log('Cannot message seller: missing data, user not logged in, or user is the seller.');
      return;
    }
    if (isProcessingAction) return;
    setIsProcessingAction(true);
    try {
      if (listing.sellerUid === currentUserId) {
        Alert.alert("Error", "You cannot message yourself.");
        setIsProcessingAction(false);
        return;
      }

      const conversation = await getOrCreateConversation(listing.listingId, currentUserId, listing.sellerUid);
      console.log('Conversation created/retrieved:', conversation.conversationId);
      router.push(`/chat/${conversation.conversationId}` as any);
    } catch (e: any) {
      console.error("Error creating or getting conversation:", e);
      Alert.alert("Error", "Error starting chat. Please try again.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!listing || !listing.sellerUid || !currentUserId || isCurrentUserTheSeller) {
      console.log('Cannot submit offer: missing data, user not logged in, or user is the seller.');
      return;
    }
    if (isProcessingAction) return;
    console.log('Submit Offer pressed for listing:', listing.listingId, 'by user:', currentUserId);
    alert(`Offer button pressed. Implement offer screen for listing: ${listing.listingId}`);
  };

  if (isLoading || authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D92630" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20, alignSelf: 'flex-start', paddingLeft: 10 }}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20, alignSelf: 'flex-start', paddingLeft: 10 }}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.errorText}>Item data is unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const carouselImages = listing.imageUrls && listing.imageUrls.length > 0
    ? listing.imageUrls.map((url, index) => ({ id: `${listing.listingId}-img-${index}`, url }))
    : [{ id: 'placeholder-1', url: '' }];

  // Prepare seller data for SellerCard
  const sellerName = seller?.displayName || (listing?.sellerUid ? 'Loading seller...' : 'Seller N/A');
  const sellerAvatarUrl = seller?.photoURL; // Can be undefined, SellerCard has a default
  const sellerLocation = seller?.location; // Can be undefined, SellerCard handles this
  
  const listingCreatedAt = listing.createdAt instanceof Timestamp ? formatDate(listing.createdAt) : 'Recently';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={carouselImages} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>${listing.price ? listing.price.toFixed(2) : '0.00'}</Text>
          
          <Text style={styles.description}>{listing.description || 'No description provided.'}</Text>
          
          {listing.condition && (
             <View style={{ marginTop: 0, marginBottom: 16 }}>
              <Text style={styles.conditionHeader}>Condition</Text>
              <Text style={[styles.conditionText, { color: getConditionColor(listing.condition) }]}>
                {listing.condition}
              </Text>
            </View>
          )}
          
          <SellerCard 
            name={sellerName}
            avatarUrl={sellerAvatarUrl}
            location={sellerLocation}
            createdAt={listingCreatedAt} 
          />
          
          <View style={styles.buttonsContainer}>
            {!isCurrentUserTheSeller ? (
              <>
                <SecondaryButton 
                  title={isProcessingAction ? "Processing..." : "Message Seller"} 
                  onPress={handleMessageSeller} 
                  disabled={isProcessingAction || authLoading || !currentUser}
                />
                <PrimaryButton 
                  title="Submit Offer" 
                  onPress={handleSubmitOffer} 
                  disabled={isProcessingAction || authLoading || !currentUser}
                />
              </>
            ) : (
              <PrimaryButton 
                title="Edit Listing (Coming Soon)" 
                onPress={() => console.log('Edit listing for:', listing?.listingId)} 
                disabled={true}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 