export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  review_count: number;
  images: string[];
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
  };
  amenities: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  type: string;
  latitude?: number;
  longitude?: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  amenities: string[];
}

export interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  totalPrice: number;
}

export type SortOption = 'recommended' | 'price-low' | 'price-high' | 'rating-high';