export interface User {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  email: string;
  location: string;
  stats: {
    listings: number;
    sold: number;
    purchased: number;
  }
}

export const CURRENT_USER: User = {
  id: 'user1',
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  joinedDate: 'September 2023',
  email: 'alex.johnson@wisc.edu',
  location: 'Lakeshore',
  stats: {
    listings: 7,
    sold: 4,
    purchased: 3
  }
}; 