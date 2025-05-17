export interface Listing {
  id: string;
  title: string;
  price: number;
  postedAt: string;
  imageUri: string;
  unreadOffersCount: number;
}

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Kitchen',
  'Textbooks',
  'Sports',
  'Bikes',
  'Other'
];

export const MY_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Nike Crewneck',
    price: 25,
    postedAt: '1 month ago',
    imageUri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    unreadOffersCount: 3
  },
  {
    id: '2',
    title: 'Nike Crewneck',
    price: 25,
    postedAt: '1 month ago',
    imageUri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    unreadOffersCount: 2
  },
  {
    id: '3',
    title: 'Nike Crewneck',
    price: 25,
    postedAt: '1 month ago',
    imageUri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    unreadOffersCount: 0
  }
];

export interface Offer {
  id: string;
  buyerName: string;
  offerPrice: number;
  listingTitle: string;
  timestamp: string;
}

export const MY_OFFERS: Offer[] = [
  {
    id: 'o1',
    buyerName: 'John Smith',
    offerPrice: 20,
    listingTitle: 'Nike Crewneck',
    timestamp: '2 days ago'
  },
  {
    id: 'o2',
    buyerName: 'Sarah Johnson',
    offerPrice: 22,
    listingTitle: 'Nike Crewneck',
    timestamp: '5 days ago'
  }
]; 