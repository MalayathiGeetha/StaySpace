import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Users, Bed, Bath, MapPin, Shield, Award, Wifi, Car, Utensils, Waves, AlertCircle } from 'lucide-react';
import { useListing, useListingAvailability } from '../hooks/useListings';
import { useReservations } from '../hooks/useReservations';
import { DateRangePicker } from '../components/DateRangePicker';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { BookingState } from '../types';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { listing, loading, error } = useListing(id || '');
  const { createReservation, loading: reservationLoading } = useReservations();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    checkIn: null,
    checkOut: null,
    guests: 1,
    totalPrice: 0,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Check availability for selected dates
  const { available: isAvailable, loading: availabilityLoading } = useListingAvailability(
    id || '', 
    booking.checkIn, 
    booking.checkOut
  );

  const calculateTotalPrice = () => {
    if (!booking.checkIn || !booking.checkOut || !listing) return 0;
    const nights = Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = listing.price * nights;
    const serviceFee = subtotal * 0.14;
    const taxes = subtotal * 0.12;
    return subtotal + serviceFee + taxes;
  };

  const handleBooking = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!booking.checkIn || !booking.checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    if (!listing) {
      setBookingError('Listing information not available');
      return;
    }

    if (isAvailable === false) {
      setBookingError('These dates are no longer available. Please select different dates.');
      return;
    }

    setBookingError(null);

    try {
      const totalPrice = calculateTotalPrice();
      
      const reservationData = {
        listing_id: listing.id,
        guest_count: booking.guests,
        check_in: booking.checkIn.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        check_out: booking.checkOut.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        total_price: totalPrice
      };

      const { data, error } = await createReservation(reservationData);

      if (error) {
        setBookingError(error);
        return;
      }

      if (data) {
        setBookingSuccess(true);
        // Reset booking form
        setBooking({
          checkIn: null,
          checkOut: null,
          guests: 1,
          totalPrice: 0,
        });
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create reservation');
    }
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />,
    'Kitchen': <Utensils className="w-5 h-5" />,
    'Pool': <Waves className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading listing details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error ? 'Error loading listing' : 'Listing not found'}
            </h1>
            {error && <p className="text-gray-600 mb-4">{error}</p>}
            <Link to="/" className="text-coral-500 hover:text-coral-600 font-medium">
              Return to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canBook = booking.checkIn && booking.checkOut && isAvailable !== false && !availabilityLoading;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{listing.rating}</span>
              <span className="text-sm">({listing.review_count} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="relative mb-4">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex gap-2 mb-6">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-coral-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-bold text-gray-900">${listing.price}</span>
                <span className="text-gray-600">/night</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{listing.rating}</span>
              </div>
            </div>

            {/* Success Message */}
            {bookingSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Booking Confirmed!</p>
                <p className="text-sm">Your reservation has been successfully created.</p>
              </div>
            )}

            {/* Error Message */}
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {bookingError}
              </div>
            )}

            {/* Availability Warning */}
            {booking.checkIn && booking.checkOut && isAvailable === false && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Dates Not Available</p>
                  <p className="text-sm">These dates are already booked. Please select different dates.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <DateRangePicker
                checkIn={booking.checkIn}
                checkOut={booking.checkOut}
                onCheckInChange={(date) => setBooking({ ...booking, checkIn: date })}
                onCheckOutChange={(date) => setBooking({ ...booking, checkOut: date })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={booking.guests}
                    onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500 outline-none"
                  >
                    {[...Array(listing.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability Status */}
              {booking.checkIn && booking.checkOut && (
                <div className="text-sm">
                  {availabilityLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coral-500"></div>
                      <span>Checking availability...</span>
                    </div>
                  ) : isAvailable === true ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available for your dates</span>
                    </div>
                  ) : isAvailable === false ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Not available for these dates</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            
            {booking.checkIn && booking.checkOut && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    ${listing.price} x {Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                  </span>
                  <span className="font-medium">
                    ${(listing.price * Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">
                    ${(listing.price * Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)) * 0.14).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">
                    ${(listing.price * Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)) * 0.12).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleBooking}
              disabled={reservationLoading || bookingSuccess || !canBook}
              className="w-full bg-coral-500 hover:bg-coral-600 disabled:bg-coral-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {reservationLoading ? 'Creating Reservation...' : 
               bookingSuccess ? 'Reservation Created' :
               !user ? 'Sign in to Reserve' :
               !booking.checkIn || !booking.checkOut ? 'Select dates to reserve' :
               isAvailable === false ? 'Dates not available' :
               availabilityLoading ? 'Checking availability...' :
               'Reserve'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Hosted by {listing.host.name}</h3>
                  {listing.host.superhost && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>Superhost</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{listing.guests} guests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{listing.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{listing.bathrooms} bathrooms</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {amenityIcons[amenity] || <Shield className="w-5 h-5" />}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Safety & Property</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Self check-in with keypad</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Security cameras on property</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Smoke detector</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">Carbon monoxide detector</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </div>
  );
};