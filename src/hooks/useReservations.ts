import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface CreateReservationData {
  listing_id: string;
  guest_count: number;
  check_in: string; // YYYY-MM-DD format
  check_out: string; // YYYY-MM-DD format
  total_price: number;
}

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createReservation = async (reservationData: CreateReservationData) => {
    if (!user) {
      throw new Error('User must be authenticated to create a reservation');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          listing_id: reservationData.listing_id,
          user_id: user.id,
          guest_count: reservationData.guest_count,
          check_in: reservationData.check_in,
          check_out: reservationData.check_out,
          total_price: reservationData.total_price,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getUserReservations = async () => {
    if (!user) {
      throw new Error('User must be authenticated to view reservations');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          listings (
            title,
            location,
            images,
            host_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reservations';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createReservation,
    getUserReservations,
    loading,
    error
  };
};