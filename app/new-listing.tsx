import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { CATEGORIES } from '../MY_LISTINGS';

// Firestore integration
import { useAuth } from '../contexts/AuthContext';
import { addListing, Listing } from '../services/firestore';

export default function NewListingScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get the authenticated user

  const [title, setTitle] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [displayPrice, setDisplayPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<Listing['condition']>('Good'); // Default condition
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Placeholder for image URLs

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format price with $ sign
  useEffect(() => {
    if (priceInput === '') {
      setDisplayPrice('');
    } else {
      // Remove non-numeric characters except decimal point
      const numericValue = priceInput.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '');
      
      setDisplayPrice('$' + formattedValue);
    }
  }, [priceInput]);

  // Handle price input changes
  const handlePriceChange = (text: string) => {
    // If user enters a value with $ already, remove it
    const value = text.replace('$', '');
    setPriceInput(value);
  };
  
  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      title.trim() !== '' && 
      priceInput.trim() !== '' && 
      parseFloat(priceInput) > 0 && // Ensure price is valid
      category !== '' && 
      description.trim() !== '' &&
      condition !== undefined
      // Add image validation if necessary: imageUrls.length > 0
    );
  }, [title, priceInput, category, description, condition]);

  const handlePostListing = async () => {
    if (!isFormValid) {
      Alert.alert('Incomplete Form', 'Please fill all required fields correctly.');
      return;
    }
    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to post a listing.');
      // router.push('/login'); // Optionally redirect to login
      return;
    }

    setIsSubmitting(true);
    try {
      const listingData: Omit<Listing, 'listingId' | 'createdAt' | 'updatedAt' | 'status' | 'viewCount' | 'searchKeywords'> = {
        sellerUid: user.uid,
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(priceInput),
        category,
        condition,
        imageUrls, // Will be empty for now, add image upload later
        // isTradeable and location can be added as optional fields later
      };

      const newListingId = await addListing(listingData);
      Alert.alert('Success', 'Your listing has been posted successfully!');
      // Reset form or navigate
      router.back(); 
      // Consider resetting form state here if staying on the page
      // setTitle(''); setPriceInput(''); setCategory(''); setDescription(''); setCondition('Good'); setImageUrls([]);

    } catch (error: any) {
      console.error('Error posting listing:', error);
      Alert.alert('Error', error.message || 'Failed to post listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions: Listing['condition'][] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="chevron-left" size={28} color="black" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Create Listing</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="$0.00"
              keyboardType="numeric"
              value={displayPrice}
              onChangeText={handlePriceChange}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Category</Text>
            <Pressable 
              style={styles.input} 
              onPress={() => !isSubmitting && setShowCategoryPicker(!showCategoryPicker)}
              disabled={isSubmitting}
            >
              <View style={styles.selectContainer}>
                <Text style={[styles.selectText, !category && styles.placeholder]}>
                  {category || "Select Category"}
                </Text>
                <Feather name={showCategoryPicker ? "chevron-up" : "chevron-down"} size={20} color="#999" />
              </View>
            </Pressable>

            {showCategoryPicker && (
              <View style={styles.categoryDropdown}>
                <ScrollView 
                  style={styles.categoryScroll}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {CATEGORIES.map((cat: string) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.categoryOptionText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.label}>Condition</Text>
            <Pressable
              style={styles.input}
              onPress={() => !isSubmitting && setShowConditionPicker(!showConditionPicker)}
              disabled={isSubmitting}
            >
              <View style={styles.selectContainer}>
                <Text style={[styles.selectText, !condition && styles.placeholder]}>
                  {condition || "Select Condition"}
                </Text>
                <Feather name={showConditionPicker ? "chevron-up" : "chevron-down"} size={20} color="#999" />
              </View>
            </Pressable>

            {showConditionPicker && (
              <View style={styles.categoryDropdown}>
                <ScrollView
                  style={styles.categoryScroll}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {conditionOptions.map((cond) => (
                    <TouchableOpacity
                      key={cond}
                      style={styles.categoryOption}
                      onPress={() => {
                        setCondition(cond);
                        setShowConditionPicker(false);
                      }}
                    >
                      <Text style={styles.categoryOptionText}>{cond}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter Description"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Images (coming soon)</Text>
            <View style={styles.imageUploadPlaceholder}>
                <Text style={styles.imageUploadText}>Image upload functionality will be added here.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.postButton,
              (!isFormValid || isSubmitting) && styles.postButtonDisabled
            ]}
            onPress={handlePostListing}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.postButtonText}>Post Listing</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 10, // Adjust for status bar on Android
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    // Removed alignSelf: 'flex-start' to keep it in row with title if needed, adjust if title is separate
  },
  titleContainer: {
    // If headerTitle is part of header, this might not be needed or needs to be adjusted
    paddingHorizontal: 24, 
    marginBottom: 20,
    alignItems: 'center', // Center title
  },
  headerTitle: {
    fontFamily: 'Inter-Bold', // Make sure Inter-Bold is loaded
    fontSize: 24,
    fontWeight: 'bold', // Fallback if custom font not loaded
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Ensure space for the button at the bottom
  },
  label: {
    fontFamily: 'Inter-SemiBold', // Make sure Inter-SemiBold is loaded
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F0F0F2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular', // Make sure Inter-Regular is loaded
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48, // Consistent height with TextInput
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  categoryDropdown: {
    marginTop: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200, // Limit height
  },
  categoryScroll: {
    // flex: 1, // if it's within a defined height container (like categoryDropdown)
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  categoryOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  textArea: {
    backgroundColor: '#F0F0F2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 120, // Default height for multi-line
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'white', // Ensure it's not transparent over scrolling content
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  postButton: {
    backgroundColor: '#D92630', // Example primary color
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#E0E0E0', // Greyed out color
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600', // Fallback
  },
  imageUploadPlaceholder: {
    marginTop: 8,
    height: 100,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
  },
  imageUploadText: {
    color: '#999',
    fontFamily: 'Inter-Regular',
  }
}); 