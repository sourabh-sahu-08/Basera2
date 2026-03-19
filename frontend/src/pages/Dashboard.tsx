import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Listing, Mess, Booking, Subscription, Offer, Conversation } from '../types';
import {
  Building2, MapPin, Star, Heart, Activity, User as UserIcon, LogOut, ChevronRight, CheckCircle, Clock, ShieldCheck, Camera, Check, ChefHat, Trash2, Home, Utensils, Calendar, Settings, Bell, TrendingUp, Users, Coffee, Menu, Search, Filter, Mail, Phone, Lock, Eye, EyeOff, LayoutDashboard, CalendarDays, Key, CreditCard, Tag, FileText, ArrowUpRight, Copy, ExternalLink, Plus, Map, PlayCircle, MessageCircle, Info, ChevronDown, Award, Globe, HeartPulse, XCircle, FilePlus, GraduationCap, UploadCloud, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ChatBox from '../components/ChatBox';

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showMessModal, setShowMessModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [newMenu, setNewMenu] = useState('');
  const [newMess, setNewMess] = useState({ name: '', location: '', price_per_month: '', menu: '', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80' });
  const [newListing, setNewListing] = useState({
    type: 'pg' as 'pg' | 'hostel' | 'flat',
    name: '',
    location: '',
    price: 0,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    description: '',
    terms: '',
    contact: '',
    amenities: '',
    gender: 'unisex' as 'male' | 'female' | 'unisex'
  });
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount_percent: 0,
    target_type: 'listing' as 'listing' | 'mess',
    target_id: 0,
    expiry_date: ''
  });

  const [listingImages, setListingImages] = useState<File[]>([]);

  const handleListingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        return allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024;
      });
      if (validFiles.length !== files.length) {
        alert("Some files were rejected. Only JPG/PNG/PDF under 5MB are allowed.");
      }
      setListingImages(prev => [...prev, ...validFiles]);
    }
  };

  const removeListingImage = (index: number) => {
    setListingImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const offersData = await api.fetchOffers();
        setOffers(offersData);

        if (user.role === 'owner') {
          const [listingsData, bookingsData, convData] = await Promise.all([
            api.fetchOwnerListings(user.id),
            api.fetchOwnerBookings(user.id),
            api.fetchConversations(user.id)
          ]);
          setListings(listingsData);
          setBookings(bookingsData);
          setConversations(convData);
        } else if (user.role === 'mess_owner') {
          const [messesData, subsData] = await Promise.all([
            api.fetchOwnerMesses(user.id),
            api.fetchOwnerSubscriptions(user.id)
          ]);
          setMesses(messesData);
          setSubscriptions(subsData);
          if (messesData.length > 0) setNewMenu(messesData[0].menu);
        } else if (user.role === 'student') {
          const [bookingsData, subsData] = await Promise.all([
            api.fetchStudentBookings(user.id),
            api.fetchStudentSubscriptions(user.id)
          ]);
          setBookings(bookingsData);
          setSubscriptions(subsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const success = await api.updateBookingStatus(id, status);
      if (success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateMenu = async (messId: number) => {
    try {
      const success = await api.updateMenu(messId, newMenu);
      if (success) {
        setMesses(prev => prev.map(m => m.id === messId ? { ...m, menu: newMenu } : m));
        setShowMenuModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createOffer = async () => {
    try {
      const data = await api.createOffer({ ...newOffer, owner_id: user?.id });
      if (data.id) {
        setOffers(prev => [...prev, { ...newOffer, id: data.id, owner_id: user!.id }]);
        setShowOfferModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createListing = async () => {
    if (listingImages.length < 4) {
      alert("Please upload at least 4 property images.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('owner_id', user?.id.toString() || '');
      formData.append('type', newListing.type);
      formData.append('name', newListing.name);
      formData.append('location', newListing.location);
      formData.append('price', newListing.price.toString());
      formData.append('description', newListing.description);
      formData.append('terms', newListing.terms);
      formData.append('contact', newListing.contact);
      formData.append('amenities', newListing.amenities);
      formData.append('gender', newListing.gender || 'unisex');
      
      listingImages.forEach((file) => {
        formData.append('images', file);
      });

      const data = await api.createListing(formData);
      if (data.id) {
        const listingsData = await api.fetchOwnerListings(user!.id);
        setListings(listingsData);
        setShowListingModal(false);
        setListingImages([]);
        setNewListing({
          type: 'pg', name: '', location: '', price: 0, image: '', description: '', terms: '', contact: '', amenities: '', gender: 'unisex'
        });
      }
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    }
  };

  const deleteListing = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const success = await api.deleteListing(id);
      if (success) {
        setListings(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBookingAndResubmit = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this rejected booking and resubmit?')) return;
    try {
      await api.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // --- RENDER CONTENT ---
  let content = null;

  if (user.role === 'student') {
    content = (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full -z-10" />

          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100/50 text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tightest leading-tight">
              My <span className="text-brand-600">Basera.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium mt-2">Managing your student life in Bilaspur.</p>
          </div>

          <div className="flex gap-3">
            <button className="w-12 h-12 glass-card flex items-center justify-center text-zinc-400 hover:text-brand-600 hover:border-brand-100 transition-all rounded-2xl">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 glass-card flex items-center justify-center text-zinc-400 hover:text-brand-600 hover:border-brand-100 transition-all rounded-2xl">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Housing Section */}
            <section className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50/50 rounded-bl-[5rem] -mr-16 -mt-16 z-0 group-hover:bg-brand-100/50 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Active Housing</h2>
                  <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-widest text-brand-600 hover:underline">Browse Listings</button>
                </div>

                {bookings.length === 0 ? (
                  <div className="py-20 text-center bg-zinc-50/50 rounded-[2rem] border-2 border-dashed border-zinc-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Home className="w-10 h-10 text-zinc-200" />
                    </div>
                    <p className="text-zinc-400 font-bold mb-8">No properties booked yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="btn-brand"
                    >
                      Find a PG
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {bookings.map(b => (
                      <motion.div
                        key={b.id}
                        whileHover={{ y: -5 }}
                        className="glass-card rounded-[2rem] p-4 group"
                      >
                        <div className="relative h-40 rounded-[1.5rem] overflow-hidden mb-6">
                          <img src={b.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-brand-700 border border-white/50 uppercase tracking-widest">
                            {b.status === 'pending_verification' ? 'Pending Verif.' : b.status}
                          </div>
                        </div>
                        <h3 className="text-xl font-extrabold text-zinc-900 mb-1">{b.property_name}</h3>
                        <div className="flex items-center text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-6">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-500" /> {b.location}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                          <span className="text-brand-600 font-black text-lg">₹{b.price}<span className="text-[10px] font-bold opacity-60">/mo</span></span>
                          <div className="flex items-center gap-2">
                            {b.status === 'rejected' && (
                              <button onClick={() => deleteBookingAndResubmit(b.id)} className="px-3 h-10 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                                Resubmit
                              </button>
                            )}
                            <button className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 transition-colors shadow-lg">
                              <Search className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Offers Section */}
            <section className="bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-extrabold tracking-tight">Student Perks</h2>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Tag className="w-5 h-5 text-brand-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.length === 0 ? (
                    <p className="text-zinc-500 font-medium italic">Scanning for new deals...</p>
                  ) : (
                    offers.map(offer => (
                      <div key={offer.id} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors relative group/offer">
                        <div className="text-brand-400 font-black text-2xl mb-1">{offer.discount_percent}% OFF</div>
                        <div className="font-extrabold text-white text-base mb-2">{offer.title}</div>
                        <p className="text-zinc-400 text-xs font-medium leading-relaxed line-clamp-2">{offer.description}</p>
                        <div className="mt-4 inline-flex items-center px-3 py-1 bg-brand-500/10 text-brand-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-500/20">
                          Ends {offer.expiry_date}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-premium">
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-10 tracking-tight">Resources</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Coffee, label: 'Tiffin Service', path: '/messes', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100/50' },
                  { icon: Users, label: 'Find Roomie', path: '/roomies', color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100/50' },
                  { icon: Calendar, label: 'Rent Logs', path: '/rent-logs', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100/50' },
                  { icon: MapPin, label: 'Koni Guide', path: '/guide', color: 'bg-brand-50 text-brand-700', border: 'border-brand-100/50' },
                ].map((action, i) => (
                  <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-zinc-50/50 hover:bg-white border border-transparent hover:border-zinc-100 hover:shadow-premium transition-all group overflow-hidden relative">
                    <div className={`w - 14 h - 14 ${action.color} ${action.border} border rounded - [1.25rem] flex items - center justify - center mb - 4 group - hover: scale - 110 transition - transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-900 transition-colors text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            {/* Meal Plan Card */}
            <section className="bg-accent-600 rounded-[3rem] p-10 text-white shadow-xl shadow-orange-100 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 blur-[80px] rounded-full group-hover:bg-white/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white text-accent-600 px-3 py-1.5 rounded-full shadow-lg">Active Plan</span>
                </div>

                <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Daily Feasts</h2>

                {subscriptions.length === 0 ? (
                  <div>
                    <p className="text-orange-100 text-sm font-medium leading-relaxed mb-10 opacity-80">You don't have an active mess plan. Good food is just a tap away.</p>
                    <button
                      onClick={() => navigate('/messes')}
                      className="w-full py-4 bg-white text-accent-600 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Browse Messes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subscriptions.map(s => (
                      <div key={s.id} className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 hover:bg-white/20 transition-colors">
                        <div className="font-extrabold text-xl mb-1">{s.mess_name}</div>
                        <div className="text-orange-100/60 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                          <MapPin className="w-3 h-3 mr-1.5" /> {s.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="p-2 bg-white rounded-xl shadow-lg">
                            <CheckCircle className="w-4 h-4 text-accent-600" />
                          </div>
                          <span className="font-black text-lg">₹{s.price_per_month}<span className="text-[10px] font-bold opacity-60">/mo</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Profile Card */}
            <section className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-premium group">
              <div className="flex items-center space-x-5 mb-10">
                <div className="w-20 h-20 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-zinc-100 group-hover:bg-brand-50 transition-colors">
                  <UserIcon className="w-10 h-10 text-zinc-200 group-hover:text-brand-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900 leading-tight">{user.full_name}</h3>
                  <div className="inline-flex items-center px-2 py-0.5 bg-zinc-900 text-white rounded text-[8px] font-black uppercase tracking-widest mt-2">
                    Verified ID
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-5 bg-zinc-50/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all duration-300">
                  <span>Modify Credentials</span>
                  <Settings className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-zinc-50/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500 hover:bg-brand-600 hover:text-white transition-all duration-300">
                  <span>Help & Support</span>
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
  else if (user.role === 'owner') {
    content = (
      <div className="min-h-screen bg-emerald-50/30 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Stats */}
            <div className="lg:w-80 shrink-0 space-y-6">
              <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200">
                <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold mb-1">Property Manager</h1>
                <p className="text-emerald-400 text-xs mb-8">Welcome back, {user.full_name.split(' ')[0]}</p>

                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Properties</div>
                    <div className="text-3xl font-black">{listings.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Active Bookings</div>
                    <div className="text-3xl font-black">{bookings.length}</div>
                  </div>
                  <div className="pt-6 border-t border-emerald-800">
                    <button
                      onClick={() => setShowListingModal(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-emerald-900/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Property</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-900 mb-4">Manage Offers</h3>
                <button
                  onClick={() => {
                    setNewOffer({ ...newOffer, target_type: 'listing', target_id: listings[0]?.id || 0 });
                    setShowOfferModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-600 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  <span>Create New Offer</span>
                </button>
                <div className="mt-4 space-y-2">
                  {offers.filter(o => o.owner_id === user.id).map(o => (
                    <div key={o.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                      <div className="font-bold text-emerald-700">{o.discount_percent}% OFF - {o.title}</div>
                      <div className="text-zinc-400 mt-1">Expires: {o.expiry_date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">+12% this month</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">85% Occupancy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-emerald-950">Student Requests</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{bookings.filter(b => b.status === 'pending_verification').length} Pending</span>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-emerald-50/50 border-b border-emerald-100">
                          <th className="px-8 py-5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Student</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Property</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Date</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} className="border-b border-emerald-50 hover:bg-emerald-50/20 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-xs">
                                  {b.student_name?.[0]}
                                </div>
                                <span className="font-bold text-emerald-950 text-sm">{b.student_name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm text-emerald-700">{b.property_name}</td>
                            <td className="px-8 py-5 text-xs text-emerald-400">{new Date(b.booking_date).toLocaleDateString()}</td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                {b.status === 'pending_verification' || b.status === 'pending' ? (
                                  <>
                                    <a href={b.aadhar_card_url} target="_blank" rel="noreferrer" title="Aadhar" className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><FileText className="w-5 h-5"/></a>
                                    <a href={b.college_id_url} target="_blank" rel="noreferrer" title="College ID" className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"><FileText className="w-5 h-5"/></a>
                                    <a href={b.declaration_url} target="_blank" rel="noreferrer" title="Declaration" className="p-2 text-purple-500 hover:bg-purple-50 rounded-xl transition-colors"><FileText className="w-5 h-5"/></a>
                                    
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                      className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors"
                                      title="Approve"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'rejected')}
                                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                      title="Reject"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </button>
                                  </>
                                ) : (
                                  <span className={`text - xs font - bold px - 3 py - 1 rounded - full ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    } `}>
                                    {b.status.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr><td colSpan={4} className="px-8 py-12 text-center text-emerald-300 text-sm italic">No student requests yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-emerald-950">Active Conversations</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{conversations.length} Threads</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conversations.map(conv => (
                    <div key={`${conv.listing_id}-${conv.student_id}`} onClick={() => setActiveChat(conv)} className="bg-white rounded-[2rem] p-6 border border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-all flex flex-col gap-3 group">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            {conv.student_name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-950 leading-tight">{conv.student_name}</h3>
                            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">{conv.listing_name}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">{new Date(conv.last_message_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-zinc-500 truncate bg-zinc-50 p-3 rounded-xl border border-zinc-100 italic">"{conv.last_message}"</p>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <div className="bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-sm text-center col-span-2 text-emerald-400 italic">No messages yet.</div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black text-emerald-950 mb-6">My Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listings.map(listing => (
                    <div key={listing.id} className="bg-white rounded-[2rem] p-4 border border-emerald-100 shadow-sm flex gap-6 group">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                        <img src={listing.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 py-2">
                        <h3 className="font-bold text-emerald-950 mb-1">{listing.name}</h3>
                        <p className="text-emerald-500 text-xs mb-4">{listing.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-emerald-600">₹{listing.price}</span>
                          <div className="flex gap-2">
                            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"><Settings className="w-4 h-4" /></button>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (user.role === 'mess_owner') {
    if (messes.length === 0) {
      content = (
        <div className="min-h-screen bg-orange-50/30 pt-24 pb-20 px-4 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-premium flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full" />
              <ChefHat className="w-12 h-12 text-orange-600 relative z-10" />
            </div>

            <h1 className="text-4xl font-black text-orange-950 tracking-tight mb-4">Setup Your Kitchen</h1>
            <p className="text-orange-900/60 font-medium mb-10 leading-relaxed">
              Welcome to Basera, Chef! You don't have any registered messes yet. Create one now to start accepting subscriptions and managing your daily menu.
            </p>

            <button
              onClick={() => setShowMessModal(true)}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20"
            >
              <Plus className="w-5 h-5" />
              Register My Mess
            </button>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="min-h-screen bg-orange-50/30 pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm flex items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[5rem] -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Utensils className="w-3 h-3 mr-1" /> Kitchen Hub
                  </div>
                  <h1 className="text-4xl font-black text-orange-950 tracking-tight">Welcome, Chef</h1>
                  <p className="text-orange-600/60 mt-1">Ready for today's service at {messes[0]?.name}?</p>
                </div>
                <div className="relative z-10 hidden sm:block">
                  <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-200">
                    <Coffee className="text-white w-10 h-10" />
                  </div>
                </div>
              </div>

              <div className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-100 flex flex-col justify-center">
                <div className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mb-1">Active Subscribers</div>
                <div className="text-4xl font-black">{subscriptions.length}</div>
                <div className="mt-2 text-xs text-orange-100 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +3 today</div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Monthly Revenue</div>
                <div className="text-4xl font-black text-orange-950">₹{subscriptions.length * (messes[0]?.price_per_month || 0)}</div>
                <div className="mt-2 text-xs text-emerald-500 font-bold">Paid in full</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Menu Management */}
              <div className="lg:col-span-1 space-y-8">
                <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-orange-950">Daily Menu</h2>
                    <button className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"><Settings className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-6">
                    {messes.map(mess => (
                      <div key={mess.id} className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100/50">
                        <div className="flex items-center text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
                          <Utensils className="w-4 h-4 mr-2" /> Current Menu
                        </div>
                        <p className="text-orange-900 font-medium text-lg leading-relaxed">
                          {mess.menu}
                        </p>
                        <button
                          onClick={() => setShowMenuModal(true)}
                          className="mt-6 w-full py-3 bg-white border border-orange-200 text-orange-600 rounded-2xl font-bold text-sm hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                        >
                          Update Today's Menu
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                  <h3 className="font-bold text-orange-950 mb-6">Manage Offers</h3>
                  <button
                    onClick={() => {
                      setNewOffer({ ...newOffer, target_type: 'mess', target_id: messes[0]?.id || 0 });
                      setShowOfferModal(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-orange-50 text-orange-600 py-3 rounded-2xl font-bold text-sm hover:bg-orange-100 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Create New Offer</span>
                  </button>
                  <div className="mt-4 space-y-2">
                    {offers.filter(o => o.owner_id === user.id).map(o => (
                      <div key={o.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs">
                        <div className="font-bold text-orange-700">{o.discount_percent}% OFF - {o.title}</div>
                        <div className="text-zinc-400 mt-1">Expires: {o.expiry_date}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                  <h3 className="font-bold text-orange-950 mb-6">Kitchen Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                      <span className="text-sm font-bold text-emerald-700">Open for Service</span>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                      <span className="text-sm font-bold text-orange-700">Next Meal: Dinner</span>
                      <span className="text-xs font-bold text-orange-400">7:30 PM</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right: Subscriber List */}
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-orange-950">Active Subscribers</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300" />
                      <input type="text" placeholder="Search student..." className="pl-10 pr-4 py-2 bg-orange-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-200 w-48" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscriptions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-orange-50/30 rounded-2xl border border-orange-100/50 group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-600 font-black">
                            {s.student_name?.[0]}
                          </div>
                          <div>
                            <div className="font-bold text-orange-950 text-sm">{s.student_name}</div>
                            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Joined {new Date(s.start_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <button className="p-2 text-orange-200 group-hover:text-red-400 transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {subscriptions.length === 0 && (
                      <div className="col-span-2 py-12 text-center text-orange-300 italic">No active subscribers yet</div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      );
    }

  }

  return (
    <div className="relative">
      {content}

      {/* MODALS */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Create New Offer</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Offer Title</label>
                  <input
                    type="text"
                    value={newOffer.title}
                    onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    placeholder="e.g. Early Bird Discount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Discount %</label>
                    <input
                      type="number"
                      value={newOffer.discount_percent}
                      onChange={e => setNewOffer({ ...newOffer, discount_percent: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newOffer.expiry_date}
                      onChange={e => setNewOffer({ ...newOffer, expiry_date: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description</label>
                  <textarea
                    value={newOffer.description}
                    onChange={e => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200 h-24"
                    placeholder="Describe the offer..."
                  />
                </div>
                <button
                  onClick={createOffer}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
                >
                  Publish Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showMenuModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMenuModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Update Today's Menu</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Menu Content</label>
                  <textarea
                    value={newMenu}
                    onChange={e => setNewMenu(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200 h-48"
                    placeholder="e.g. Breakfast: Poha, Lunch: Dal Tadka..."
                  />
                </div>
                <button
                  onClick={() => updateMenu(messes[0].id)}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Update Menu
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showListingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowListingModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Property Name</label>
                  <input
                    type="text"
                    value={newListing.name}
                    onChange={e => setNewListing({ ...newListing, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    placeholder="e.g. Shree Ram PG"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Type</label>
                  <select
                    value={newListing.type}
                    onChange={e => setNewListing({ ...newListing, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="pg">PG</option>
                    <option value="hostel">Hostel</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Preferred Gender</label>
                  <select
                    value={newListing.gender}
                    onChange={e => setNewListing({ ...newListing, gender: e.target.value as any })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="unisex">Unisex / Anyone</option>
                    <option value="male">Boys Only</option>
                    <option value="female">Girls Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={newListing.location}
                    onChange={e => setNewListing({ ...newListing, location: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    placeholder="e.g. Koni Main Road"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Price (Monthly)</label>
                  <input
                    type="number"
                    value={newListing.price}
                    onChange={e => setNewListing({ ...newListing, price: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={newListing.contact}
                    onChange={e => setNewListing({ ...newListing, contact: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Amenities (comma separated)</label>
                  <input
                    type="text"
                    value={newListing.amenities}
                    onChange={e => setNewListing({ ...newListing, amenities: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200"
                    placeholder="WiFi, RO Water, Bed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description</label>
                  <textarea
                    value={newListing.description}
                    onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-200 h-24"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Property Images (Min 4. JPG/PNG. Max 5MB)</label>
                  <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-6 text-center hover:bg-emerald-50 transition-colors relative cursor-pointer group">
                    <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleListingFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-sm font-bold text-emerald-700">Click or drag files here to upload</p>
                    <p className="text-xs text-emerald-500 mt-1">{listingImages.length} files selected</p>
                  </div>
                  {listingImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {listingImages.map((file, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 group/image">
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => removeListingImage(idx)} className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-100 transition-opacity hover:bg-red-50">
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={createListing}
                className="w-full mt-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Add Property
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mess Modal */}
      <AnimatePresence>
        {showMessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessModal(false)}
              className="absolute inset-0 bg-orange-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-orange-950">Setup Your Kitchen</h3>
                <button
                  onClick={() => setShowMessModal(false)}
                  className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-400"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Mess Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200"
                    value={newMess.name}
                    onChange={e => setNewMess({ ...newMess, name: e.target.value })}
                    placeholder="e.g. Anand Mess"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200"
                    value={newMess.location}
                    onChange={e => setNewMess({ ...newMess, location: e.target.value })}
                    placeholder="e.g. Koni, Bilaspur"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Price Per Month (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200"
                    value={newMess.price_per_month}
                    onChange={e => setNewMess({ ...newMess, price_per_month: e.target.value })}
                    placeholder="e.g. 3000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Initial Daily Menu</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200"
                    value={newMess.menu}
                    onChange={e => setNewMess({ ...newMess, menu: e.target.value })}
                    placeholder="e.g. Roti, Dal, Paneer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-orange-200"
                    value={newMess.image}
                    onChange={e => setNewMess({ ...newMess, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button
                onClick={async () => {
                  const mess = await api.createMess({ ...newMess, owner_id: user?.id });
                  if (mess) {
                    setMesses([mess, ...messes]);
                    setShowMessModal(false);
                    setNewMess({ name: '', location: '', price_per_month: '', menu: '', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80' });
                  }
                }}
                className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                Register Kitchen
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Owner Chat Modal */}
      {user && activeChat && (
        <ChatBox 
          listingId={activeChat.listing_id}
          currentUserId={user.id}
          targetUserId={activeChat.student_id}
          targetUserName={activeChat.student_name}
          isOpen={!!activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
