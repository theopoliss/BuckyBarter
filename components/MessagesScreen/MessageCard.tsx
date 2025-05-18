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
        
        <View style={styles.itemRow}>
          <Text style={styles.itemTitle}>{message.itemTitle}</Text>
          <View style={[
            styles.typeBadge,
            message.type === 'buying' ? styles.buyingBadge : styles.sellingBadge
          ]}>
            <Text style={[
              styles.typeBadgeText,
              message.type === 'buying' ? styles.buyingText : styles.sellingText
            ]}>{message.type}</Text>
          </View>
        </View>
        
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontFamily: 'Inter-Medium',
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