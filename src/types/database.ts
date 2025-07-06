export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          title: string;
          location: string;
          price: number;
          rating: number | null;
          review_count: number | null;
          images: string[] | null;
          host_name: string;
          host_avatar: string | null;
          is_superhost: boolean | null;
          amenities: string[] | null;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          guests: number;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          available: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          location: string;
          price: number;
          rating?: number | null;
          review_count?: number | null;
          images?: string[] | null;
          host_name: string;
          host_avatar?: string | null;
          is_superhost?: boolean | null;
          amenities?: string[] | null;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          guests: number;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          available?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          price?: number;
          rating?: number | null;
          review_count?: number | null;
          images?: string[] | null;
          host_name?: string;
          host_avatar?: string | null;
          is_superhost?: boolean | null;
          amenities?: string[] | null;
          property_type?: string;
          bedrooms?: number;
          bathrooms?: number;
          guests?: number;
          description?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          available?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      reservations: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          guest_count: number;
          check_in: string;
          check_out: string;
          date_range: string | null;
          total_price: number;
          status: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          listing_id: string;
          user_id: string;
          guest_count: number;
          check_in: string;
          check_out: string;
          date_range?: string | null;
          total_price: number;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          listing_id?: string;
          user_id?: string;
          guest_count?: number;
          check_in?: string;
          check_out?: string;
          date_range?: string | null;
          total_price?: number;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}