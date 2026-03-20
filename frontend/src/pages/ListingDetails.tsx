import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { api } from '../services/api';
import {
  MapPin, BookmarkPlus, Check, ArrowLeft, MessageCircle,
  Wifi, Droplets, Wind, ShieldCheck, Car, Utensils, Zap, Tv,
  WashingMachine, Dumbbell, Star, Calendar, Users, Home, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import ChatBox from '../components/ChatBox';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'wifi': <Wifi className="w-5 h-5" />,
  'ro water': <Droplets className="w-5 h-5" />,
  'ac': <Wind className="w-5 h-5" />,
  'security': <ShieldCheck className="w-5 h-5" />,
  'parking': <Car className="w-5 h-5" />,
  'meals': <Utensils className="w-5 h-5" />,
  'power backup': <Zap className="w-5 h-5" />,
  'tv': <Tv className="w-5 h-5" />,
  'laundry': <WashingMachine className="w-5 h-5" />,
  'gym': <Dumbbell className="w-5 h-5" />,
};

function getAmenityIcon(name: string) {
  const key = name.toLowerCase();
  for (const k of Object.keys(AMENITY_ICONS)) {
    if (key.includes(k)) return AMENITY_ICONS[k];
  }
  return <Check className="w-5 h-5" />;
}

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const [isBooked, setIsBooked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (id) {
      api.fetchListingById(id)
        .then(data => { setListing(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-zinc-100 rounded-[2.5rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 bg-zinc-100 rounded-xl w-3/4" />
              <div className="h-6 bg-zinc-100 rounded-xl w-1/2" />
              <div className="h-32 bg-zinc-100 rounded-xl mt-8" />
            </div>
            <div className="h-64 bg-zinc-100 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="pt-32 pb-20 px-4 text-center min-h-screen">
        <h2 className="text-3xl font-black mb-4">Property Not Found</h2>
        <button onClick={() => navigate('/')} className="text-brand-600 font-bold hover:underline">Return Home</button>
      </div>
    );
  }

  const processImg = (img: string) => {
    if (!img) return img;
    if (!img.startsWith('http') && !img.startsWith('/')) return '/uploads/' + img;
    return img;
  };

  let images: string[] = [];
  try {
    const parsed = JSON.parse(listing.image);
    images = Array.isArray(parsed) ? parsed.map(processImg) : [processImg(String(parsed))];
  } catch {
    images = [processImg(listing.image)];
  }

  const amenities = (listing.amenities || '').split(',').filter(Boolean).map(a => a.trim());

  const handleBookClick = () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { alert('Please switch to a Student role to book.'); return; }
    navigate(`/book/${listing.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>

        {/* Hero Image Gallery */}
        <div className="mb-10 rounded-[2.5rem] overflow-hidden bg-zinc-100 relative">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-[55vh] min-h-[380px]">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                />
                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-brand-700 rounded-xl shadow-sm">
                    {listing.type}
                  </span>
                  {listing.gender && (
                    <span className="px-4 py-2 bg-blue-50/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-blue-700 rounded-xl shadow-sm">
                      {listing.gender === 'male' ? '♂ Boys' : listing.gender === 'female' ? '♀ Girls' : 'Unisex'}
                    </span>
                  )}
                </div>
                {/* Image counter */}
                <div className="absolute bottom-6 right-6 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md">
                  {activeImg + 1} / {images.length}
                </div>
              </div>
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 bg-white border-t border-zinc-100">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${i === activeImg ? 'border-brand-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-[55vh] flex items-center justify-center">
              <span className="text-zinc-400 font-bold">No Image Available</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Title & Location */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-widest border border-brand-100">
                  <Home className="w-3 h-3 mr-1.5" /> {listing.type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  <Star className="w-3 h-3 mr-1.5 fill-amber-500" /> Top Listed
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">{listing.name}</h1>
              <div className="flex items-center text-zinc-500 font-semibold text-base">
                <MapPin className="w-5 h-5 mr-2 text-brand-500 shrink-0" />
                {listing.location}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Monthly Rent', value: `₹${listing.price}`, icon: <Calendar className="w-5 h-5 text-brand-500" /> },
                { label: 'Type', value: listing.type?.toUpperCase(), icon: <Home className="w-5 h-5 text-purple-500" /> },
                { label: 'For', value: listing.gender === 'male' ? 'Boys' : listing.gender === 'female' ? 'Girls' : 'Unisex', icon: <Users className="w-5 h-5 text-blue-500" /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm flex flex-col gap-2">
                  {stat.icon}
                  <div className="text-xl font-black text-zinc-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this Property</h2>
              <p className="text-zinc-600 leading-relaxed text-base whitespace-pre-wrap">
                {listing.description || 'A comfortable and well-maintained property ideal for students and working professionals. Safe, clean, and close to all major amenities.'}
              </p>
            </div>

            {/* Facilities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-brand-50/50 rounded-2xl border border-brand-100/50 hover:bg-brand-50 transition-colors"
                    >
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100/50 shrink-0">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-sm font-bold text-zinc-800">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms */}
            {listing.terms && (
              <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> House Rules & Terms
                </h2>
                <p className="text-amber-800 leading-relaxed whitespace-pre-wrap text-sm">{listing.terms}</p>
              </div>
            )}

            {/* Location Widget */}
            <div className="bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Location</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-lg">{listing.location}</div>
                  <div className="text-zinc-500 text-sm mt-1">Near GGU Campus, Koni, Bilaspur, Chhattisgarh</div>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(listing.location + ' Bilaspur')}`, '_blank')}
                    className="mt-3 flex items-center gap-2 text-brand-600 font-bold text-sm hover:text-brand-800 transition-colors"
                  >
                    Open in Google Maps <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar */}
          <div>
            <div className="sticky top-32 space-y-4">
              <div className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-premium">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-black text-zinc-900">₹{listing.price}</span>
                  <span className="text-zinc-500 font-bold ml-2">/ month</span>
                </div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">No booking fees</p>

                <div className="space-y-3">
                  <button
                    onClick={handleBookClick}
                    disabled={isBooked}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isBooked
                      ? 'bg-brand-50 text-brand-700 pointer-events-none'
                      : 'bg-brand-600 text-white shadow-xl shadow-brand-100 hover:bg-brand-700'
                    }`}
                  >
                    {isBooked ? <Check className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
                    <span>{isBooked ? 'Request Sent' : 'Book Now'}</span>
                  </button>

                  <button
                    onClick={() => { if (!user) { navigate('/login'); return; } setIsChatOpen(true); }}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Owner</span>
                  </button>


                </div>
              </div>

              {/* Safety badge */}
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-800 text-sm">Verified Listing</div>
                  <p className="text-emerald-600 text-xs mt-0.5 leading-relaxed">This property is verified by Basera. Your documents are securely handled.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && listing && (
        <ChatBox
          listingId={listing.id}
          currentUserId={user.id}
          targetUserId={listing.owner_id}
          targetUserName={listing.name || 'Property Owner'}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
