import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
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

export default function NewListingScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [displayPrice, setDisplayPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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
      category !== '' && 
      description.trim() !== ''
    );
  }, [title, priceInput, category, description]);

  const handlePostListing = () => {
    // Only proceed if form is valid
    if (!isFormValid) return;
    
    // Here you would typically save the listing data
    console.log({ 
      title, 
      price: parseFloat(priceInput), 
      category, 
      description 
    });
    
    // Navigate back to the sell dashboard
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.scrollView}>
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
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="$0.00"
              keyboardType="numeric"
              value={displayPrice}
              onChangeText={handlePriceChange}
            />

            <Text style={styles.label}>Category</Text>
            <Pressable 
              style={styles.input} 
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <View style={styles.selectContainer}>
                <Text style={[styles.selectText, !category && styles.placeholder]}>
                  {category || "Select Category"}
                </Text>
                <Feather name="chevron-down" size={20} color="#999" />
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

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter Description"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.postButton,
              !isFormValid && styles.postButtonDisabled
            ]}
            onPress={handlePostListing}
            disabled={!isFormValid}
          >
            <Text style={styles.postButtonText}>Post Listing</Text>
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
    paddingTop: 10,
  },
  backButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  categoryDropdown: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    marginTop: -20,
    marginBottom: 20,
    maxHeight: 200,
    zIndex: 10,
  },
  categoryScroll: {
    paddingHorizontal: 8,
  },
  categoryOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    height: 200,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  postButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 