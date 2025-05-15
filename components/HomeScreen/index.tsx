import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import CategoryChip from './CategoryChip';
import { CATEGORIES, FEATURED_ITEMS, RECENT_ITEMS } from './DATA';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6; // 60% of screen width for featured items
const RECENT_ITEM_WIDTH = width * 0.42; // 42% of screen width for recently added items
const COLUMN_WIDTH = (width - 52) / 2; // 20px padding on each side, 12px gap

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9B9B9B" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search for items" 
            placeholderTextColor="#9B9B9B"
            style={styles.searchInput}
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
              onPress={() => console.log(`Selected category: ${category}`)}
            />
          ))}
        </ScrollView>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Feather name="chevron-right" size={20} color="#D92630" />
        </View>
        
        <FlatList
          horizontal
          data={FEATURED_ITEMS}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + 10}
          decelerationRate="fast"
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <ProductCard 
              item={item}
              width={ITEM_WIDTH}
              onPress={() => console.log(`Selected featured item: ${item.id}`)}
            />
          )}
        />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <Feather name="chevron-right" size={20} color="#D92630" />
        </View>
        
        <FlatList
          horizontal
          data={RECENT_ITEMS}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={RECENT_ITEM_WIDTH + 10}
          decelerationRate="fast"
          contentContainerStyle={styles.recentList}
          renderItem={({ item }) => (
            <ProductCard 
              item={item}
              width={RECENT_ITEM_WIDTH}
              onPress={() => console.log(`Selected recent item: ${item.id}`)}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    color: '#000',
  },
  searchContainer: {
    height: 48,
    backgroundColor: '#F2F3F4',
    borderRadius: 12,
    marginTop: 16,
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
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: '#000',
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 10,
  },
  recentList: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 8,
  },
  recentGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
  },
}); 