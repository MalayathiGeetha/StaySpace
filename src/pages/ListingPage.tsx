import React, { useState, useMemo } from 'react';
import { FilterBar } from '../components/FilterBar';
import { ListingCard } from '../components/ListingCard';
import { Header } from '../components/Header';
import { useListings } from '../hooks/useListings';
import { FilterState, SortOption } from '../types';

export const ListingPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    amenities: [],
  });

  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // Pass filters to useListings hook for database-level filtering
  const { listings, loading, error } = useListings(filters);

  // Now we only need to sort the already-filtered results from the database
  const sortedListings = useMemo(() => {
    const listingsToSort = [...listings];

    switch (sortBy) {
      case 'price-low':
        return listingsToSort.sort((a, b) => a.price - b.price);
      case 'price-high':
        return listingsToSort.sort((a, b) => b.price - a.price);
      case 'rating-high':
        return listingsToSort.sort((a, b) => b.rating - a.rating);
      case 'recommended':
      default:
        return listingsToSort.sort((a, b) => {
          // Sort by rating first, then by superhost status
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return (b.host.superhost ? 1 : 0) - (a.host.superhost ? 1 : 0);
        });
    }
  }, [listings, sortBy]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recommended':
        return 'Sort by: Recommended';
      case 'price-low':
        return 'Price: Low to High';
      case 'price-high':
        return 'Price: High to Low';
      case 'rating-high':
        return 'Rating: High to Low';
      default:
        return 'Sort by: Recommended';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {filters.checkIn && filters.checkOut 
                  ? 'Finding available stays for your dates...' 
                  : 'Loading amazing stays...'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load listings</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find your perfect stay</h1>
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedListings.length} stays found
            </h2>
            {filters.checkIn && filters.checkOut && (
              <p className="text-sm text-gray-600 mt-1">
                Available from {filters.checkIn.toLocaleDateString()} to {filters.checkOut.toLocaleDateString()}
              </p>
            )}
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
          >
            <option value="recommended">{getSortLabel('recommended')}</option>
            <option value="price-low">{getSortLabel('price-low')}</option>
            <option value="price-high">{getSortLabel('price-high')}</option>
            <option value="rating-high">{getSortLabel('rating-high')}</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        
        {sortedListings.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No available listings found</h3>
            <p className="text-gray-600">
              {filters.checkIn && filters.checkOut 
                ? 'Try different dates or adjust your filters to find more places to stay.'
                : 'Try adjusting your filters to find more places to stay.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};