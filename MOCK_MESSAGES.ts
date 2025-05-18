export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  type: 'buying' | 'selling';
  itemTitle: string;
}

export const MOCK_MESSAGES: Message[] = [
  {
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
  {
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
  {
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
  {
    id: 'm4',
    sender: {
      id: 'user4',
      name: 'David Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
    },
    lastMessage: 'Thanks, I got the item!',
    timestamp: 'Yesterday',
    unread: false,
    type: 'buying',
    itemTitle: 'Desk Lamp'
  },
  {
    id: 'm5',
    sender: {
      id: 'user5',
      name: 'Alex Morgan',
      avatar: 'https://randomuser.me/api/portraits/women/56.jpg'
    },
    lastMessage: 'Can you send more pictures?',
    timestamp: 'Monday',
    unread: false,
    type: 'selling',
    itemTitle: 'Specialized Bike'
  }
]; 