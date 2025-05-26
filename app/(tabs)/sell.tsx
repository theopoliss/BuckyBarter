import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import FAB from '../../components/SellDashboard/FAB';
import ListingCard from '../../components/SellDashboard/ListingCard';
import OfferCard from '../../components/SellDashboard/OfferCard';
import TabSwitch from '../../components/SellDashboard/TabSwitch';
import TopBar from '../../components/SellDashboard/TopBar';
// import { MY_LISTINGS, MY_OFFERS } from '../../MY_LISTINGS'; // Remove mock data import

import { useAuth } from '../../contexts/AuthContext';
import {
    getListingsBySeller,
    getOffersBySeller,
    Listing, // Import type
    Offer // Import type
} from '../../services/firestore';

export default function SellDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'offers'>('listings');
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // If user is not logged in, clear data and potentially show a message or redirect
      setMyListings([]);
      setMyOffers([]);
      // Optionally, navigate to login or show a prompt
      // Alert.alert("Please log in", "You need to be logged in to view your sell dashboard.");
      // router.push('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'listings') {
          const listings = await getListingsBySeller(user.uid);
          setMyListings(listings);
          setMyOffers([]); // Clear other tab's data
        } else if (activeTab === 'offers') {
          const offers = await getOffersBySeller(user.uid);
          setMyOffers(offers);
          setMyListings([]); // Clear other tab's data
        }
      } catch (e: any) {
        console.error("Error fetching sell dashboard data:", e);
        setError(e.message || 'Failed to fetch data.');
        Alert.alert("Error", e.message || 'Failed to load your items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, activeTab]); // Refetch when user or activeTab changes

  const handleListingPress = (listingId: string) => {
    // Navigate to listing details - ensure this route exists and is correctly set up
    router.push(`/item/${listingId}` as any); // Cast to any if type checking complains for dynamic routes
  };

  const handleOfferPress = (offerId: string) => {
    // Navigate to offer details - this route might need to be created
    // For now, let's assume it pushes to a generic item related to the offer's listingId
    const offer = myOffers.find(o => o.offerId === offerId);
    if (offer) {
        router.push(`/item/${offer.listingId}` as any); // Or a dedicated offer detail screen e.g. /offer/${offerId}
    } else {
        Alert.alert("Error", "Offer details not found.");
    }
  };

  const handleNewListing = () => {
    router.push('/new-listing');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#D92630" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {/* Optionally add a retry button here */}
        </View>
      );
    }
    
    if (!user) {
        return (
            <View style={styles.centeredMessageContainer}>
                <Text style={styles.infoText}>Please log in to see your listings and offers.</Text>
                {/* Button to login? */}
                {/* <TouchableOpacity onPress={() => router.push('/login')}><Text>Login</Text></TouchableOpacity> */}
            </View>
        )
    }

    if (activeTab === 'listings') {
      if (myListings.length === 0) {
        return <View style={styles.centeredMessageContainer}><Text style={styles.infoText}>You haven't posted any listings yet.</Text></View>;
      }
      return (
        <FlatList
          data={myListings}
          keyExtractor={(item) => item.listingId}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => handleListingPress(item.listingId)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      // Offers tab
      if (myOffers.length === 0) {
        return <View style={styles.centeredMessageContainer}><Text style={styles.infoText}>You haven't received or made any offers yet.</Text></View>;
      }
      return (
        <FlatList
          data={myOffers}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => (
            // Ensure OfferCard is adapted to take an Offer type prop
            <OfferCard
              offer={item} 
              onPress={() => handleOfferPress(item.offerId)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <TopBar />
        <TabSwitch
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {renderContent()}
      </View>
      
      <FAB onPress={handleNewListing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listContainer: {
    paddingTop: 4,
    paddingHorizontal: 24,
    paddingBottom: 100, // For FAB visibility
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'Inter-Regular', // Ensure fonts are loaded
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
}); 