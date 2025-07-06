import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Listing, FilterState } from '../types';
import { Database } from '../types/database';

type ListingRow = Database['public']['Tables']['listings']['Row'];

const transformListing = (row: ListingRow): Listing => ({
  id: row.id,
  title: row.title,
  location: row.location,
  price: Math.round(row.price / 100), // Convert from cents to dollars
  rating: row.rating || 0,
  review_count: row.review_count || 0,
  images: row.images || [],
  host: {
    name: row.host_name,
    avatar: row.host_avatar || '',
    superhost: row.is_superhost || false,
  },
  amenities: row.amenities || [],
  description: row.description || '',
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  guests: row.guests,
  type: row.property_type,
  latitude: row.latitude || undefined,
  longitude: row.longitude || undefined,
  available: row.available || true,
  created_at: row.created_at || '',
  updated_at: row.updated_at || '',
});

export const useListings = (filters?: FilterState) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('listings')
          .select('*')
          .eq('available', true);

        // Apply filters
        if (filters) {
          // Location filter
          if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
          }

          // Guest capacity filter
          if (filters.guests > 1) {
            query = query.gte('guests', filters.guests);
          }

          // Amenities filter
          if (filters.amenities.length > 0) {
            query = query.contains('amenities', filters.amenities);
          }

          // Date availability filter - this is the key scalable improvement
          if (filters.checkIn && filters.checkOut) {
            const checkInStr = filters.checkIn.toISOString().split('T')[0];
            const checkOutStr = filters.checkOut.toISOString().split('T')[0];
            
            // Use a NOT EXISTS subquery to exclude listings with overlapping reservations
            // This is much more efficient than fetching all data and filtering client-side
            query = query.not('id', 'in', 
              supabase
                .from('reservations')
                .select('listing_id')
                .eq('status', 'confirmed')
                .or(`date_range.overlap.[${checkInStr},${checkOutStr})`)
            );
          }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const transformedListings = data.map(transformListing);
        setListings(transformedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Re-run the effect by updating a dependency
  };

  return { listings, loading, error, refetch };
};

export const useListing = (id: string) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .eq('available', true)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setListing(transformListing(data));
        } else {
          setListing(null);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch listing');
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  return { listing, loading, error };
};

// Hook for checking availability of a specific listing for given dates
export const useListingAvailability = (listingId: string, checkIn: Date | null, checkOut: Date | null) => {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkIn || !checkOut || !listingId) {
        setAvailable(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const checkInStr = checkIn.toISOString().split('T')[0];
        const checkOutStr = checkOut.toISOString().split('T')[0];

        // Check if there are any confirmed reservations that overlap with the requested dates
        const { data, error } = await supabase
          .from('reservations')
          .select('id')
          .eq('listing_id', listingId)
          .eq('status', 'confirmed')
          .overlaps('date_range', `[${checkInStr},${checkOutStr})`)
          .limit(1);

        if (error) {
          throw error;
        }

        // If no overlapping reservations found, the listing is available
        setAvailable(data.length === 0);
      } catch (err) {
        console.error('Error checking availability:', err);
        setError(err instanceof Error ? err.message : 'Failed to check availability');
        setAvailable(null);
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, [listingId, checkIn, checkOut]);

  return { available, loading, error };
};