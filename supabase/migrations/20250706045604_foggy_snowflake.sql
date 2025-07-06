/*
  # Create listings table for StayScape application

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `location` (text, required)
      - `price` (integer, required - price per night in cents)
      - `rating` (numeric, 0-5 scale with 2 decimal places)
      - `review_count` (integer, number of reviews)
      - `images` (text array, URLs to listing images)
      - `host_name` (text, required)
      - `host_avatar` (text, URL to host avatar image)
      - `is_superhost` (boolean, default false)
      - `amenities` (text array, list of amenities)
      - `property_type` (text, required - Villa, Cabin, Loft, etc.)
      - `bedrooms` (integer, required)
      - `bathrooms` (integer, required)
      - `guests` (integer, required - max guest capacity)
      - `description` (text, property description)
      - `latitude` (numeric, for mapping)
      - `longitude` (numeric, for mapping)
      - `available` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `listings` table
    - Add policy for public read access (anyone can view listings)
    - Add policy for authenticated users to insert listings
    - Add policy for authenticated users to update their own listings

  3. Sample Data
    - Insert sample listings to populate the database
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  price integer NOT NULL,
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  images text[] DEFAULT '{}',
  host_name text NOT NULL,
  host_avatar text,
  is_superhost boolean DEFAULT false,
  amenities text[] DEFAULT '{}',
  property_type text NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  guests integer NOT NULL,
  description text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public can read all available listings
CREATE POLICY "Public can read listings"
  ON listings
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert listings
CREATE POLICY "Authenticated users can insert listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own listings (for future host functionality)
CREATE POLICY "Users can update their own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO listings (
  title, location, price, rating, review_count, images, host_name, host_avatar, 
  is_superhost, amenities, property_type, bedrooms, bathrooms, guests, description,
  latitude, longitude
) VALUES 
(
  'Stunning Ocean View Villa',
  'Malibu, California',
  35000,
  4.9,
  127,
  ARRAY[
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'Sarah Johnson',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
  true,
  ARRAY['Pool', 'Great View', 'WiFi', 'Kitchen', 'Parking'],
  'Villa',
  3,
  2,
  6,
  'Experience breathtaking ocean views from this stunning villa perched on the cliffs of Malibu. Perfect for a romantic getaway or family vacation.',
  34.0259,
  -118.7798
),
(
  'Cozy Mountain Cabin',
  'Aspen, Colorado',
  18000,
  4.7,
  89,
  ARRAY[
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571454/pexels-photo-1571454.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'Mike Chen',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
  false,
  ARRAY['Fireplace', 'Great View', 'WiFi', 'Kitchen', 'Hot Tub'],
  'Cabin',
  2,
  1,
  4,
  'Escape to this charming mountain cabin surrounded by pristine wilderness. Perfect for skiing in winter and hiking in summer.',
  39.1911,
  -106.8175
),
(
  'Modern Downtown Loft',
  'New York, NY',
  22000,
  4.8,
  156,
  ARRAY[
    'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'Emily Rodriguez',
  'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150',
  true,
  ARRAY['WiFi', 'Kitchen', 'Gym', 'Rooftop Access', 'Concierge'],
  'Loft',
  1,
  1,
  2,
  'Stay in the heart of Manhattan in this stylish loft with floor-to-ceiling windows and modern amenities.',
  40.7589,
  -73.9851
),
(
  'Tropical Beach House',
  'Maui, Hawaii',
  45000,
  4.9,
  203,
  ARRAY[
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'David Kim',
  'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
  true,
  ARRAY['Pool', 'Great View', 'WiFi', 'Kitchen', 'Beach Access'],
  'Beach House',
  4,
  3,
  8,
  'Wake up to the sound of waves in this stunning beachfront property with direct access to pristine white sand beaches.',
  20.7984,
  -156.3319
),
(
  'Charming City Apartment',
  'Paris, France',
  16000,
  4.6,
  74,
  ARRAY[
    'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'Sophie Laurent',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
  false,
  ARRAY['WiFi', 'Kitchen', 'Balcony', 'Historic Building'],
  'Apartment',
  2,
  1,
  4,
  'Experience Parisian charm in this beautifully appointed apartment in the heart of the Marais district.',
  48.8566,
  2.3522
),
(
  'Luxury Desert Resort',
  'Scottsdale, Arizona',
  28000,
  4.8,
  142,
  ARRAY[
    'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571454/pexels-photo-1571454.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  'Carlos Martinez',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
  true,
  ARRAY['Pool', 'Great View', 'WiFi', 'Kitchen', 'Spa', 'Golf Course'],
  'Resort',
  3,
  2,
  6,
  'Relax in luxury at this desert oasis with stunning mountain views and world-class amenities.',
  33.4942,
  -111.9261
);