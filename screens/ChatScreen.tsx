import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
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
import { ChatMessage, getMockChatData } from '../MOCK_CHAT_MESSAGES';
import MessageBubble from '../components/ChatScreen/MessageBubble';

const ChatScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const chatData = getMockChatData(id as string);
  
  if (!chatData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Conversation not found</Text>
      </SafeAreaView>
    );
  }
  
  const { conversation, messageInfo, currentUserId } = chatData;
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to a server
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return <MessageBubble message={item} isCurrentUser={isCurrentUser} />;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
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
            source={{ uri: messageInfo.sender.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{messageInfo.sender.name}</Text>
            <View style={styles.itemInfoContainer}>
              <Text style={styles.itemTitle}>{messageInfo.itemTitle}</Text>
              <View style={[
                styles.typeBadge,
                messageInfo.type === 'buying' ? styles.buyingBadge : styles.sellingBadge
              ]}>
                <Text style={[
                  styles.typeBadgeText,
                  messageInfo.type === 'buying' ? styles.buyingText : styles.sellingText
                ]}>{messageInfo.type}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversation}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (conversation.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (conversation.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />
        
        {/* Input area */}
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
            style={[styles.sendButton, !newMessage.trim() && styles.disabledSendButton]} 
            onPress={handleSend}
            disabled={!newMessage.trim()}
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