import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getRecentListings, Listing } from '../../services/firestore';
import CategoryChip from './CategoryChip';
import { CATEGORIES } from './DATA';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6; 
const RECENT_ITEM_WIDTH = width * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredMessageContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  scrollContentContainer: {
    paddingBottom: 20, 
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 + 10 : 24, 
    paddingHorizontal: 20,
    paddingBottom: 10, 
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 30, 
    color: '#000',
  },
  searchContainer: {
    height: 48,
    backgroundColor: '#F2F3F4',
    borderRadius: 12,
    marginTop: 10, 
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontFamily: 'Inter-Regular',
    color: '#000',
    fontSize: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16, 
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20, 
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20, 
    color: '#000',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#D92630',
    marginRight: 4,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10, 
    gap: 10,
    minHeight: ITEM_WIDTH * 0.6, 
  },
  recentList: {
    paddingLeft: 20,
    paddingRight: 10, 
    gap: 10, 
    minHeight: RECENT_ITEM_WIDTH * 0.6, 
  },
  listLoadingIndicator: {
    marginVertical: 20,
    height: 50, 
    alignSelf: 'center',
  },
  emptyListContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center', 
    minHeight: 100, 
  },
  emptyListText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
    textAlign: 'center',
  },
  errorContainerTop: {
    padding: 20,
    backgroundColor: '#FFEBEE', 
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B71C1C', 
    textAlign: 'center',
  }
});

export default function HomeScreenComponent() {
  const router = useRouter(); // Restored
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [recentListings, setRecentListings] = useState<Listing[]>([]); // Restored
  const [isLoading, setIsLoading] = useState(true); 
  const [isRefreshing, setIsRefreshing] = useState(false); // Restored
  const [error, setError] = useState<string | null>(null); // Restored
  // const [searchQuery, setSearchQuery] = useState(''); // Keep commented for now

  const fetchListingsData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setError(null);
    try {
      // Fetch for "Featured" - could be same as recent or a different query later
      const { listings: featured } = await getRecentListings(5); // Get 5 for featured
      console.log('Featured listings fetched:', featured); // Keep console.log for now
      setFeaturedListings(featured);

      // Fetch for "Recently Added"
      const { listings: recent } = await getRecentListings(10); // Get 10 for recent
      console.log('Recent listings fetched:', recent); // Keep console.log for now
      setRecentListings(recent);

    } catch (e: any) {
      console.error("Error fetching listings for home screen:", e);
      const errorMessage = e.message || 'Failed to fetch listings. Please try again later.';
      setError(errorMessage);
      // if (!isRefresh) Alert.alert("Load Error", errorMessage); // Keep Alert commented for now
    } finally {
      if (!isRefresh) setIsLoading(false);
      if (isRefresh) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchListingsData();
  }, [fetchListingsData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchListingsData(true);
  }, [fetchListingsData]);

  const handleItemPress = (listingId: string) => {
    router.push(`/item/${listingId}` as any);
  };
  
  const renderListHeader = (title: string, onPressSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPressSeeAll && (
        <TouchableOpacity onPress={onPressSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <Feather name="chevron-right" size={20} color="#D92630" />
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderEmptyList = (message: string) => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>{message}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centeredMessageContainer]}>
        <ActivityIndicator size="large" color="#D92630" />
        <Text style={styles.loadingText}>Loading BuckyBarter...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Stack.Screen options={{ headerShown: false }} /> */}
      {/* Assuming header is managed by the tab navigator or a custom header component if needed */}
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContentContainer} 
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#D92630"]}/>
      }>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BuckyBarter</Text> 
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9B9B9B" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search for items... (coming soon)" 
            placeholderTextColor="#9B9B9B"
            style={styles.searchInput}
            // value={searchQuery} // Keep commented for now
            // onChangeText={setSearchQuery} // Keep commented for now
            // onSubmitEditing={handleSearchSubmit} // Keep commented for now
            editable={false} // Disabled for now
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category: string, index: number) => (
            <CategoryChip 
              key={index} 
              title={category} 
              onPress={() => console.log(`Selected category: ${category}`)} // TODO: Implement category filtering
            />
          ))}
        </ScrollView>

        {/* Error display at the top if there's a general error */}
        {error && !isLoading && !isRefreshing && (
          <View style={styles.errorContainerTop}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
        
        {/* Featured Section */}
        {renderListHeader('Featured', () => console.log("See all featured"))}
        {isRefreshing && featuredListings.length === 0 && <ActivityIndicator style={styles.listLoadingIndicator} color="#D92630" />}
        {!isLoading && !isRefreshing && !error && featuredListings.length === 0 && renderEmptyList('No featured items available right now.')}
        {featuredListings.length > 0 && (
            <FlatList
              horizontal
              data={featuredListings}
              keyExtractor={item => item?.listingId || Math.random().toString()}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + 10} // Adjust spacing as needed
              decelerationRate="fast"
              contentContainerStyle={styles.featuredList}
              renderItem={({ item }) => {
                if (!item || !item.listingId) return null;
                return (
                  <ProductCard 
                    item={item}
                    width={ITEM_WIDTH}
                    onPress={() => handleItemPress(item.listingId)}
                  />
                );
              }}
            />
        )}

        {/* Recently Added Section */}
        {renderListHeader('Recently Added', () => console.log("See all recent"))}
        {isRefreshing && recentListings.length === 0 && <ActivityIndicator style={styles.listLoadingIndicator} color="#D92630" />}
        {!isLoading && !isRefreshing && !error && recentListings.length === 0 && renderEmptyList('No recent items available yet.')}
        {recentListings.length > 0 && (
            <FlatList
              horizontal
              data={recentListings}
              keyExtractor={item => item?.listingId || Math.random().toString()}
              showsHorizontalScrollIndicator={false}
              snapToInterval={RECENT_ITEM_WIDTH + 10} // Adjust spacing
              decelerationRate="fast"
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => {
                if (!item || !item.listingId) return null;
                return (
                  <ProductCard 
                    item={item}
                    width={RECENT_ITEM_WIDTH}
                    onPress={() => handleItemPress(item.listingId)}
                  />
                );
              }}
            />
        )}

        {/* General error display can be added back next if all goes well */}
        {/* This comment block below is now redundant as the actual error display is restored above. */}
        {/* {error && !isLoading && !isRefreshing && (
          <View style={styles.errorContainerTop}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )} */}

      </ScrollView>
    </SafeAreaView>
  );
} 