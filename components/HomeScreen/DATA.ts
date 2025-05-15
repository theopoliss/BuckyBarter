export interface ProductItem {
  id: string;
  title: string;
  price: number;
  image: string;
  isNew?: boolean;
  timeAdded?: string;
  category: string;
}

export const CATEGORIES = [
  'Furniture',
  'Electronics',
  'Clothing',
  'Kitchen',
  'Textbooks'
];

export const FEATURED_ITEMS: ProductItem[] = [
  {
    id: 'f1',
    title: 'Nike Crewneck',
    price: 25,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    isNew: true,
    category: 'Clothing'
  },
  {
    id: 'f2',
    title: 'Nike Crewneck',
    price: 25,
    image: 'https://images.unsplash.com/photo-1572495641004-28421ae29ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    isNew: true,
    category: 'Clothing'
  },
  {
    id: 'f3',
    title: 'Nike Crewneck',
    price: 25,
    image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=830&q=80',
    isNew: true,
    category: 'Clothing'
  }
];

export const RECENT_ITEMS: ProductItem[] = [
  {
    id: 'r1',
    title: 'Chem 101 Textbook',
    price: 12,
    image: 'https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    timeAdded: '6d ago',
    category: 'Textbooks'
  },
  {
    id: 'r2',
    title: 'Nike Beanie',
    price: 25,
    image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=830&q=80',
    isNew: true,
    category: 'Clothing'
  },
  {
    id: 'r3',
    title: 'Specialized Bike',
    price: 80,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    category: 'Sports'
  },
  {
    id: 'r4',
    title: 'Chem 101 Textbook',
    price: 12,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    timeAdded: 'last month',
    category: 'Textbooks'
  },
  {
    id: 'r5',
    title: 'Nike Crewneck',
    price: 25,
    image: 'https://images.unsplash.com/photo-1572495641004-28421ae29ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    isNew: true,
    category: 'Clothing'
  },
  {
    id: 'r6',
    title: 'Gay Bike',
    price: 80,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    category: 'Sports'
  }
]; 