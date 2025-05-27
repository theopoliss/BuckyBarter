import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MessageBubble from '../components/ChatScreen/MessageBubble';
import { useAuth } from '../contexts/AuthContext';
import {
  Conversation,
  Message as FirestoreMessage,
  getConversationById,
  getListingById,
  getUserProfile,
  listenToMessages,
  Listing,
  markMessagesAsRead,
  sendMessage,
  Timestamp,
  UserProfile,
} from '../services/firestore';

const ChatScreen = () => {
  const router = useRouter();
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const [conversationDetails, setConversationDetails] = useState<Conversation | null>(null);
  const [otherParticipantProfile, setOtherParticipantProfile] = useState<UserProfile | null>(null);
  const [relatedListing, setRelatedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = currentUser?.uid;

  useEffect(() => {
    if (!conversationId) {
      setError('Conversation ID is missing.');
      setLoading(false);
      return;
    }
    if (!currentUserId) {
        setError('User not authenticated.');
        setLoading(false);
        return;
    }

    setLoading(true);
    const fetchConversationData = async () => {
      try {
        const convo = await getConversationById(conversationId);
        if (!convo) {
          setError('Conversation not found.');
          setLoading(false);
          return;
        }
        setConversationDetails(convo);

        const otherParticipantUid = convo.participantUids.find(uid => uid !== currentUserId);
        if (otherParticipantUid) {
          const [profile, listing] = await Promise.all([
            getUserProfile(otherParticipantUid),
            getListingById(convo.listingId),
          ]);
          setOtherParticipantProfile(profile);
          setRelatedListing(listing);
        } else {
            setError("Could not identify the other participant.");
        }
        
      } catch (e: any) {
        console.error("Error fetching conversation details:", e);
        setError(e.message || 'Failed to load conversation details.');
      } finally {
      }
    };

    fetchConversationData();
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = listenToMessages(conversationId, (newMessages) => {
      setMessages(newMessages.sort((a, b) => (b.timestamp as any) - (a.timestamp as any)));
      if (loading) setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId, loading]);

  useFocusEffect(
    useCallback(() => {
      if (conversationId && currentUserId) {
        markMessagesAsRead(conversationId, currentUserId)
          .catch(err => console.error("Failed to mark messages as read:", err));
      }
    }, [conversationId, currentUserId])
  );
  
  const handleSend = async () => {
    if (!newMessage.trim() || !currentUserId || !conversationId || !conversationDetails) return;

    const recipientUid = conversationDetails.participantUids.find(uid => uid !== currentUserId);
    if (!recipientUid) {
        Alert.alert("Error", "Could not determine the recipient.");
        return;
    }

    try {
      await sendMessage(conversationId, currentUserId, newMessage.trim(), recipientUid);
      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (e) {
      console.error("Error sending message:", e);
      Alert.alert("Error", "Could not send message.");
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const renderMessage = ({ item }: { item: FirestoreMessage }) => {
    const isCurrentUserMsg = item.senderUid === currentUserId;

    let receiverId = '';
    if (conversationDetails && item.senderUid) {
        receiverId = conversationDetails.participantUids.find(uid => uid !== item.senderUid) || '';
    }

    let formattedTimestamp = 'Sending...';
    if (item.timestamp && (item.timestamp as Timestamp).toDate) {
        formattedTimestamp = (item.timestamp as Timestamp).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (typeof item.timestamp === 'string') {
        formattedTimestamp = item.timestamp;
    }

    const chatMessageForBubble = {
      id: item.messageId,
      senderId: item.senderUid,
      receiverId: receiverId,
      text: item.text,
      timestamp: formattedTimestamp,
      isRead: true,
    };

    return <MessageBubble message={chatMessageForBubble} isCurrentUser={isCurrentUserMsg} />;
  };

  if (loading && messages.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D92630" />
        <Text style={{ marginTop: 10 }}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButtonError}>
            <Text>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const headerName = otherParticipantProfile?.displayName || 'User';
  const headerAvatar = otherParticipantProfile?.photoURL || 'https://via.placeholder.com/40';
  const itemTitle = relatedListing?.title || 'Item';
  const messageInfoType = relatedListing?.sellerUid === currentUserId ? 'selling' : 'buying';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: headerAvatar }} 
            style={styles.avatar} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{headerName}</Text>
            <View style={styles.itemInfoContainer}>
              <Text style={styles.itemTitle} numberOfLines={1}>{itemTitle}</Text>
              {relatedListing && (
                <View style={[
                  styles.typeBadge,
                  messageInfoType === 'buying' ? styles.buyingBadge : styles.sellingBadge
                ]}>
                  <Text style={[
                    styles.typeBadgeText,
                    messageInfoType === 'buying' ? styles.buyingText : styles.sellingText
                  ]}>{messageInfoType}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages.slice().sort((a, b) => {
            const tsA = a.timestamp as any;
            const tsB = b.timestamp as any;
            if (tsA?.toDate && tsB?.toDate) return tsA.toDate().getTime() - tsB.toDate().getTime();
            return (tsA?.seconds || 0) - (tsB?.seconds || 0);
          })}
          renderItem={renderMessage}
          keyExtractor={(item) => item.messageId || Math.random().toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!newMessage.trim() || authLoading) && styles.disabledSendButton]} 
            onPress={handleSend}
            disabled={!newMessage.trim() || authLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  backButtonError:{
    padding:10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingHorizontal: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  itemInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  itemTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#505050',
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyingBadge: {
    backgroundColor: '#E6F2FF',
  },
  sellingBadge: {
    backgroundColor: '#FFF0E6',
  },
  typeBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  buyingText: {
    color: '#0066cc',
  },
  sellingText: {
    color: '#D92630',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: '#999',
  },
});

export default ChatScreen; 