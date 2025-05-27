import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Message as MessageCardPropType } from '../../MOCK_MESSAGES';
import FilterTab, { FilterType } from '../../components/MessagesScreen/FilterTab';
import MessageCard from '../../components/MessagesScreen/MessageCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  Conversation as FirestoreConversation,
  getConversationsForUser,
  getListingById,
  getUserProfile,
  Listing,
  Timestamp
} from '../../services/firestore';

export interface EnrichedConversationForCard {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessageText?: string;
  lastMessageTimestamp?: string;
  isUnread: boolean;
  itemTitle?: string;
  type: 'buying' | 'selling';
  _rawConversation: FirestoreConversation;
  _rawListing?: Listing | null;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [rawConversations, setRawConversations] = useState<FirestoreConversation[]>([]);
  const [enrichedConversations, setEnrichedConversations] = useState<EnrichedConversationForCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      if (!authLoading) {
          setLoading(false);
          setEnrichedConversations([]);
      }
      return;
    }

    setLoading(true);
    setError(null);
    getConversationsForUser(currentUser.uid)
      .then(convos => {
        setRawConversations(convos);
        if (convos.length === 0) {
            setEnrichedConversations([]);
            setLoading(false);
        }
      })
      .catch(e => {
        console.error("Failed to fetch conversations:", e);
        setError("Could not load your messages.");
        setLoading(false);
      });
  }, [currentUser?.uid, authLoading]);

  useEffect(() => {
    if (rawConversations.length === 0 && !loading) return;
    if (!currentUser?.uid) return;

    const processConversations = async () => {
      setLoading(true);
      const enriched: EnrichedConversationForCard[] = [];
      for (const convo of rawConversations) {
        try {
          const otherParticipantUid = convo.participantUids.find(uid => uid !== currentUser.uid);
          let otherUser: EnrichedConversationForCard['otherUser'] = { id: '', name: 'Unknown User' };
          if (otherParticipantUid) {
            const profile = await getUserProfile(otherParticipantUid);
            otherUser = {
              id: profile?.uid || '',
              name: profile?.displayName || 'User',
              avatar: profile?.photoURL,
            };
          }

          const listing = await getListingById(convo.listingId);
          const itemTitle = listing?.title;
          const type = listing?.sellerUid === currentUser.uid ? 'selling' : 'buying';
          
          let lastMessageTimestampStr = ' ';
          if (convo.lastMessage?.timestamp) {
            const ts = convo.lastMessage.timestamp as Timestamp;
            if (ts.toDate) {
                lastMessageTimestampStr = ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                lastMessageTimestampStr = 'Date N/A';
            }
          }

          enriched.push({
            id: convo.conversationId,
            otherUser,
            lastMessageText: convo.lastMessage?.text,
            lastMessageTimestamp: lastMessageTimestampStr,
            isUnread: (convo.unreadCounts?.[currentUser.uid] || 0) > 0,
            itemTitle,
            type,
            _rawConversation: convo,
            _rawListing: listing,
          });
        } catch (e) {
          console.error(`Failed to process conversation ${convo.conversationId}:`, e);
        }
      }
      setEnrichedConversations(enriched.sort((a,b) => {
          const timeA = a._rawConversation.lastMessage?.timestamp as Timestamp;
          const timeB = b._rawConversation.lastMessage?.timestamp as Timestamp;
          return (timeB?.seconds || 0) - (timeA?.seconds || 0);
      }));
      setLoading(false);
    };

    if (rawConversations.length > 0) {
        processConversations();
    }
  }, [rawConversations, currentUser?.uid]);

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') {
      return enrichedConversations;
    }
    return enrichedConversations.filter(conv => conv.type === activeFilter);
  }, [activeFilter, enrichedConversations]);

  const handleMessagePress = (conversationId: string) => {
    console.log(`Conversation ${conversationId} pressed`);
    router.push(`/chat/${conversationId}`);
  };
  
  const onRefresh = () => {
    if (!currentUser?.uid || authLoading || loading) return;
    setLoading(true);
    setError(null);
    getConversationsForUser(currentUser.uid)
      .then(convos => {
        setRawConversations(convos);
         if (convos.length === 0) {
            setEnrichedConversations([]);
            setLoading(false);
        }
      })
      .catch(e => {
        console.error("Failed to refresh conversations:", e);
        setError("Could not refresh messages.");
        setLoading(false);
      });
  }

  if (loading && enrichedConversations.length === 0 && !error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.centeredMessageContainer}>
            <ActivityIndicator size="large" color="#D92630" />
            <Text style={{marginTop: 10, fontFamily: 'Inter-Regular'}}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.centeredMessageContainer}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          renderItem={({ item }) => {
            const messageCardData: MessageCardPropType = {
              id: item.id,
              sender: {
                id: item.otherUser.id,
                name: item.otherUser.name,
                avatar: item.otherUser.avatar || 'https://via.placeholder.com/50',
              },
              lastMessage: item.lastMessageText || '',
              timestamp: item.lastMessageTimestamp || '',
              unread: item.isUnread,
              type: item.type,
              itemTitle: item.itemTitle || 'Item Inaccessible',
            };
            return (
              <MessageCard
                message={messageCardData}
                onPress={handleMessagePress}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={onRefresh}
        />
      ) : (
        <ScrollView 
            contentContainerStyle={styles.emptyContainerScroll}
            refreshControl={<View />}
        >
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {currentUser?.uid ? 'You have no messages yet.' : 'Login to see your messages.'}
            </Text>
            </View>
        </ScrollView>
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
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#D92630',
  },
  emptyContainerScroll: {
      flexGrow: 1,
      justifyContent: 'center',
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