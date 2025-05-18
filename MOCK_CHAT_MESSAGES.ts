import { Message } from "./MOCK_MESSAGES";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatData {
  conversation: ChatMessage[];
  messageInfo: Message;
  currentUserId: string;
}

export const MOCK_CHAT_DATA: Record<string, ChatData> = {
  'm1': {
    currentUserId: 'currentUser',
    messageInfo: {
      id: 'm1',
      sender: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      lastMessage: 'Is this still available?',
      timestamp: '3:42 PM',
      unread: true,
      type: 'selling',
      itemTitle: 'Nike Crewneck'
    },
    conversation: [
      {
        id: 'msg1',
        senderId: 'user1',
        receiverId: 'currentUser',
        text: 'Hi there! Is the Nike Crewneck still available?',
        timestamp: 'Yesterday, 2:30 PM',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'currentUser',
        receiverId: 'user1',
        text: 'Yes, it is! Are you interested?',
        timestamp: 'Yesterday, 3:15 PM',
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'user1',
        receiverId: 'currentUser',
        text: 'Definitely! What size is it?',
        timestamp: 'Today, 11:30 AM',
        isRead: true
      },
      {
        id: 'msg4',
        senderId: 'currentUser',
        receiverId: 'user1',
        text: "It's a size Medium. It's in great condition, barely worn.",
        timestamp: 'Today, 11:45 AM',
        isRead: true
      },
      {
        id: 'msg5',
        senderId: 'user1',
        receiverId: 'currentUser',
        text: 'Perfect, that\'s my size! Would you be willing to meet on campus tomorrow?',
        timestamp: 'Today, 12:00 PM',
        isRead: true
      },
      {
        id: 'msg6',
        senderId: 'currentUser',
        receiverId: 'user1',
        text: 'Sure, I can meet near the Memorial Union around 3pm?',
        timestamp: 'Today, 12:30 PM',
        isRead: true
      },
      {
        id: 'msg7',
        senderId: 'user1',
        receiverId: 'currentUser',
        text: 'Is this still available?',
        timestamp: 'Today, 3:42 PM',
        isRead: false
      }
    ]
  },
  'm2': {
    currentUserId: 'currentUser',
    messageInfo: {
      id: 'm2',
      sender: {
        id: 'user2',
        name: 'Mike Peterson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      lastMessage: 'Would you take $20 for it?',
      timestamp: '2:15 PM',
      unread: true,
      type: 'selling',
      itemTitle: 'Chem 101 Textbook'
    },
    conversation: [
      {
        id: 'msg1',
        senderId: 'user2',
        receiverId: 'currentUser',
        text: 'Hey, I saw your listing for the Chem 101 textbook',
        timestamp: 'Yesterday, 1:30 PM',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'currentUser',
        receiverId: 'user2',
        text: "Hi there! Yes, it's still available.",
        timestamp: 'Yesterday, 2:00 PM',
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'user2',
        receiverId: 'currentUser',
        text: 'Great! Is it in good condition?',
        timestamp: 'Yesterday, 2:05 PM',
        isRead: true
      },
      {
        id: 'msg4',
        senderId: 'currentUser',
        receiverId: 'user2',
        text: 'Yes, barely used. I only opened it a few times for the first week of class before switching majors.',
        timestamp: 'Yesterday, 2:10 PM',
        isRead: true
      },
      {
        id: 'msg5',
        senderId: 'user2',
        receiverId: 'currentUser',
        text: 'Would you take $20 for it?',
        timestamp: 'Today, 2:15 PM',
        isRead: false
      }
    ]
  },
  'm3': {
    currentUserId: 'currentUser',
    messageInfo: {
      id: 'm3',
      sender: {
        id: 'user3',
        name: 'Emily Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      lastMessage: 'I can meet on campus tomorrow',
      timestamp: 'Yesterday',
      unread: false,
      type: 'buying',
      itemTitle: 'Sony Headphones'
    },
    conversation: [
      {
        id: 'msg1',
        senderId: 'currentUser',
        receiverId: 'user3',
        text: "Hi Emily, I'm interested in your Sony headphones. Are they still available?",
        timestamp: '2 days ago, 10:23 AM',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'user3',
        receiverId: 'currentUser',
        text: 'Hi! Yes, they are still available.',
        timestamp: '2 days ago, 11:45 AM',
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'currentUser',
        receiverId: 'user3',
        text: 'Great! Could you tell me more about the condition? Any scratches or issues with the sound?',
        timestamp: '2 days ago, 12:15 PM',
        isRead: true
      },
      {
        id: 'msg4',
        senderId: 'user3',
        receiverId: 'currentUser',
        text: "They're in excellent condition. I've only used them a few times. No scratches and the sound quality is perfect.",
        timestamp: '2 days ago, 1:30 PM',
        isRead: true
      },
      {
        id: 'msg5',
        senderId: 'currentUser',
        receiverId: 'user3',
        text: "Sounds good. I'd like to buy them. When and where could we meet?",
        timestamp: 'Yesterday, 9:20 AM',
        isRead: true
      },
      {
        id: 'msg6',
        senderId: 'user3',
        receiverId: 'currentUser',
        text: 'I can meet on campus tomorrow',
        timestamp: 'Yesterday, 10:15 AM',
        isRead: true
      }
    ]
  }
};

export const getMockChatData = (chatId: string): ChatData | undefined => {
  return MOCK_CHAT_DATA[chatId];
}; 