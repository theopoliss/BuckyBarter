import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Message } from '../../MOCK_MESSAGES';

interface MessageCardProps {
  message: Message;
  onPress: (id: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(message.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: message.sender.avatar }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{message.sender.name}</Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
        
        <Text style={styles.itemTitle}>{message.itemTitle}</Text>
        
        <Text 
          style={[styles.message, message.unread && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {message.lastMessage}
        </Text>
      </View>
      
      {message.unread && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
  },
  itemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#505050',
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6E6E6E',
  },
  unreadMessage: {
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D92630',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default MessageCard; 