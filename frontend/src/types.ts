export interface User {
  id: number;
  username: string;
  role: 'student' | 'owner' | 'mess_owner';
  full_name: string;
}

export interface Listing {
  id: number;
  owner_id: number;
  type: 'pg' | 'hostel' | 'flat';
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  terms: string;
  contact: string;
  amenities: string;
  gender?: 'male' | 'female' | 'unisex';
}

export interface Mess {
  id: number;
  owner_id: number;
  name: string;
  location: string;
  price_per_month: number;
  image: string;
  description: string;
  contact: string;
  menu: string;
}

export interface Booking {
  id: number;
  student_id: number;
  listing_id: number;
  status: 'pending' | 'pending_verification' | 'confirmed' | 'rejected' | 'cancelled';
  contact_number?: string;
  move_in_date?: string;
  duration_months?: number;
  aadhar_card_url?: string;
  college_id_url?: string;
  declaration_url?: string;
  booking_date: string;
  student_name?: string;
  property_name?: string;
  location?: string;
  price?: number;
  image?: string;
}

export interface Subscription {
  id: number;
  student_id: number;
  mess_id: number;
  status: string;
  start_date: string;
  student_name?: string;
  mess_name?: string;
  location?: string;
  price_per_month?: number;
  image?: string;
}

export interface Offer {
  id: number;
  owner_id: number;
  target_type: 'listing' | 'mess';
  target_id: number;
  title: string;
  description: string;
  discount_percent: number;
  expiry_date: string;
}
