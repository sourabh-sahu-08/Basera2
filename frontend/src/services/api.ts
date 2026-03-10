import { User, Listing, Mess, Booking, Subscription, Offer } from '../types';

export const api = {
  async login(credentials: any): Promise<{ success: boolean; user?: User; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async signup(userData: any): Promise<{ success: boolean; user?: User; error?: string }> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async fetchUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    return res.json();
  },

  async fetchOffers(): Promise<Offer[]> {
    const res = await fetch('/api/offers');
    return res.json();
  },

  async fetchOwnerListings(ownerId: number): Promise<Listing[]> {
    const res = await fetch(`/api/owner/listings/${ownerId}`);
    return res.json();
  },

  async fetchOwnerBookings(ownerId: number): Promise<Booking[]> {
    const res = await fetch(`/api/owner/bookings/${ownerId}`);
    return res.json();
  },

  async fetchOwnerMesses(ownerId: number): Promise<Mess[]> {
    const res = await fetch(`/api/owner/messes/${ownerId}`);
    return res.json();
  },

  async fetchOwnerSubscriptions(ownerId: number): Promise<Subscription[]> {
    const res = await fetch(`/api/owner/subscriptions/${ownerId}`);
    return res.json();
  },

  async fetchStudentBookings(studentId: number): Promise<Booking[]> {
    const res = await fetch(`/api/student/bookings/${studentId}`);
    return res.json();
  },

  async fetchStudentSubscriptions(studentId: number): Promise<Subscription[]> {
    const res = await fetch(`/api/student/subscriptions/${studentId}`);
    return res.json();
  },

  async updateBookingStatus(id: number, status: string): Promise<boolean> {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.ok;
  },

  async updateMenu(messId: number, menu: string): Promise<boolean> {
    const res = await fetch(`/api/messes/${messId}/menu`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu })
    });
    return res.ok;
  },

  async createListing(listing: any): Promise<{ id: number }> {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });
    return res.json();
  },

  async deleteListing(id: number): Promise<boolean> {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async createOffer(offer: any): Promise<{ id: number }> {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    });
    return res.json();
  },

  async fetchAllListings(): Promise<Listing[]> {
    const res = await fetch('/api/listings');
    return res.json();
  },

  async fetchMesses(): Promise<Mess[]> {
    const res = await fetch('/api/messes');
    return res.json();
  },

  async createMess(messData: any): Promise<Mess> {
    const res = await fetch('/api/messes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messData)
    });
    return res.json();
  },

  async createBooking(studentId: number, listingId: number): Promise<{ id: number }> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, listing_id: listingId })
    });
    return res.json();
  },

  async createSubscription(studentId: number, messId: number): Promise<{ id: number }> {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, mess_id: messId })
    });
    return res.json();
  }
};
