import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import FAB from '../../components/SellDashboard/FAB';
import ListingCard from '../../components/SellDashboard/ListingCard';
import OfferCard from '../../components/SellDashboard/OfferCard';
import TabSwitch from '../../components/SellDashboard/TabSwitch';
import TopBar from '../../components/SellDashboard/TopBar';
import { MY_LISTINGS, MY_OFFERS } from '../../MY_LISTINGS';

export default function SellDashboardScreen() {
  const [activeTab, setActiveTab] = useState<'listings' | 'offers'>('listings');
  const router = useRouter();

  const handleListingPress = (id: string) => {
    // Navigate to listing details
    router.push(`/(tabs)/listing/${id}` as any);
  };

  const handleOfferPress = (id: string) => {
    // Navigate to offer details
    router.push(`/(tabs)/offer/${id}` as any);
  };

  const handleNewListing = () => {
    // Navigate to new listing screen
    router.push('/new-listing');
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
        
        {activeTab === 'listings' ? (
          <FlatList
            data={MY_LISTINGS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListingCard 
                listing={item} 
                onPress={handleListingPress} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={MY_OFFERS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <OfferCard 
                offer={item} 
                onPress={handleOfferPress} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    paddingBottom: 100,
  },
}); 