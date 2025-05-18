import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { MOCK_MESSAGES } from '../../MOCK_MESSAGES';
import FilterTab, { FilterType } from '../../components/MessagesScreen/FilterTab';
import MessageCard from '../../components/MessagesScreen/MessageCard';

export default function MessagesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') {
      return MOCK_MESSAGES;
    }
    return MOCK_MESSAGES.filter(message => message.type === activeFilter);
  }, [activeFilter]);

  const handleMessagePress = (id: string) => {
    console.log(`Message ${id} pressed`);
    // Navigate to message detail screen
    // router.push(`/message/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <FilterTab
          title="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <FilterTab
          title="Buying"
          isActive={activeFilter === 'buying'}
          onPress={() => setActiveFilter('buying')}
        />
        <FilterTab
          title="Selling"
          isActive={activeFilter === 'selling'}
          onPress={() => setActiveFilter('selling')}
        />
      </View>
      
      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageCard
              message={item}
              onPress={handleMessagePress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#000',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6E6E6E',
  },
}); 