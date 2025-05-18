import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_ITEMS } from '../../app/data/MOCK_ITEMS';
import ImageCarousel from './ImageCarousel';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import SellerCard from './SellerCard';

const ItemDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = MOCK_ITEMS[id as string];

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Item not found</Text>
      </SafeAreaView>
    );
  }

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={item.images} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          
          <Text style={styles.description}>{item.description}</Text>
          
          <SellerCard seller={item.seller} createdAt={item.createdAt} />
          
          <View style={styles.buttonsContainer}>
            <SecondaryButton 
              title="Message Seller" 
              onPress={() => console.log('Message Seller pressed')} 
            />
            <PrimaryButton 
              title="Submit Offer" 
              onPress={() => console.log('Submit Offer pressed')} 
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 20,
    color: '#000',
    marginBottom: 24,
  },
  buttonsContainer: {
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
});

export default ItemDetailScreen; 