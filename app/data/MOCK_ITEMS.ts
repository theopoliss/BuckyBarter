export interface ItemImage {
  id: string;
  url: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  location: string;
}

export interface Item {
  id: string;
  title: string;
  price: number;
  description: string;
  images: ItemImage[];
  seller: Seller;
  createdAt: string;
}

// The default seller for items that don't have one specified
const DEFAULT_SELLER: Seller = {
  id: "user1",
  name: "Sarah Doe",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  location: "Lakeshore"
};

export const MOCK_ITEMS: Record<string, Item> = {
  // Featured Items
  "f1": {
    id: "f1",
    title: "Nike Crewneck",
    price: 25,
    description: "Lightly worn black Nike Crewneck, size men's small. Only wore a few times, in excellent condition with no damages or stains. Perfect for casual wear or layering.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80" },
      { id: "img2", url: "https://images.unsplash.com/photo-1572495641004-28421ae29ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" },
      { id: "img3", url: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&auto=format&fit=crop&w=830&q=80" }
    ],
    seller: DEFAULT_SELLER,
    createdAt: "45 min ago"
  },
  "f2": {
    id: "f2",
    title: "Nike Crewneck",
    price: 25,
    description: "Navy blue Nike Crewneck in excellent condition. Size medium, very comfortable and warm.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1572495641004-28421ae29ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" }
    ],
    seller: {
      id: "user2",
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Downtown"
    },
    createdAt: "1 day ago"
  },
  "f3": {
    id: "f3",
    title: "Nike Crewneck",
    price: 25,
    description: "Black Nike Crewneck sweatshirt. Size large. Barely worn, like new condition.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&auto=format&fit=crop&w=830&q=80" }
    ],
    seller: {
      id: "user3",
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      location: "Campus"
    },
    createdAt: "2 days ago"
  },

  // Recently Added Items
  "r1": {
    id: "r1",
    title: "Chem 101 Textbook",
    price: 12,
    description: "Chemistry 101 textbook, 5th edition. Some highlighting but all pages intact. Perfect for intro to chemistry.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80" }
    ],
    seller: DEFAULT_SELLER,
    createdAt: "6d ago"
  },
  "r2": {
    id: "r2",
    title: "Nike Beanie",
    price: 25,
    description: "Black Nike beanie, one size fits all. Warm and stylish for winter.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&auto=format&fit=crop&w=830&q=80" }
    ],
    seller: {
      id: "user2",
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Downtown"
    },
    createdAt: "1 week ago"
  },
  "r3": {
    id: "r3",
    title: "Specialized Bike",
    price: 80,
    description: "Specialized road bike in good condition. Some minor scratches but rides perfectly. 21 speed, medium frame size.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80" }
    ],
    seller: {
      id: "user4",
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      location: "Off Campus"
    },
    createdAt: "2 weeks ago"
  },
  "r4": {
    id: "r4",
    title: "Chem 101 Textbook",
    price: 12,
    description: "Chemistry 101 textbook in good condition. Some highlighting but all pages intact. ISBN: 978-3-16-148410-0",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" }
    ],
    seller: {
      id: "user5",
      name: "Miranda Lee",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      location: "Downtown"
    },
    createdAt: "last month"
  },
  "r5": {
    id: "r5",
    title: "Nike Crewneck",
    price: 25,
    description: "Navy blue Nike Crewneck, lightly used. Size small, perfect condition.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1572495641004-28421ae29ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" }
    ],
    seller: DEFAULT_SELLER,
    createdAt: "3 weeks ago"
  },
  "r6": {
    id: "r6",
    title: "Gay Bike",
    price: 80,
    description: "Vintage road bike, well maintained. 18 speed, medium frame. Perfect for commuting around campus.",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80" }
    ],
    seller: {
      id: "user6",
      name: "Taylor Parker",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      location: "Lakeshore"
    },
    createdAt: "1 month ago"
  }
}; 