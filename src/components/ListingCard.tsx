import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <Link to={`/listing/${listing.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          {listing.host.superhost && (
            <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-xs font-medium">
              Superhost
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-coral-500 transition-colors">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.type}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{listing.bedrooms} bed</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{listing.bathrooms} bath</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{listing.amenities.length - 3} more</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-gray-900">${listing.price}</span>
              <span className="text-sm text-gray-600">/night</span>
            </div>
            {listing.review_count > 0 && (
              <span className="text-xs text-gray-500">({listing.review_count} reviews)</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};