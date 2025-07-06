import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Filter } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const amenityOptions = [
  'Pool', 'Great View', 'WiFi', 'Kitchen', 'Parking', 'Hot Tub', 
  'Fireplace', 'Gym', 'Beach Access', 'Spa', 'Golf Course', 'Balcony'
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleDateChange = (type: 'checkIn' | 'checkOut', value: string) => {
    const date = value ? new Date(value) : null;
    onFiltersChange({
      ...filters,
      [type]: date,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-full p-2 mb-8">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="flex-1 py-3 px-2 border-none outline-none text-sm font-medium"
          />
        </div>
        
        <div className="w-px h-8 bg-gray-200"></div>
        
        <div className="flex items-center gap-2 px-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={filters.checkIn ? filters.checkIn.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateChange('checkIn', e.target.value)}
            className="py-3 px-2 border-none outline-none text-sm font-medium"
          />
        </div>
        
        <div className="w-px h-8 bg-gray-200"></div>
        
        <div className="flex items-center gap-2 px-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={filters.checkOut ? filters.checkOut.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateChange('checkOut', e.target.value)}
            className="py-3 px-2 border-none outline-none text-sm font-medium"
          />
        </div>
        
        <div className="w-px h-8 bg-gray-200"></div>
        
        <div className="flex items-center gap-2 px-4">
          <Users className="w-4 h-4 text-gray-400" />
          <select
            value={filters.guests}
            onChange={(e) => onFiltersChange({ ...filters, guests: parseInt(e.target.value) })}
            className="py-3 px-2 border-none outline-none text-sm font-medium bg-transparent"
          >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests</option>
            <option value={5}>5+ Guests</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
        
        <button className="p-3 bg-coral-500 hover:bg-coral-600 rounded-full transition-colors">
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {showAdvancedFilters && (
        <div className="mt-4 p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.amenities.includes(amenity)
                    ? 'bg-coral-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};