import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { api } from '../services/api';
import { MapPin, CheckCircle2, Phone, Copy, BookmarkPlus, Check, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import ChatBox from '../components/ChatBox';

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNumber, setShowNumber] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api.fetchListingById(id)
        .then(data => {
          setListing(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-zinc-100 rounded-[2.5rem]"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 bg-zinc-100 rounded-xl w-3/4"></div>
              <div className="h-6 bg-zinc-100 rounded-xl w-1/2"></div>
              <div className="h-32 bg-zinc-100 rounded-xl mt-8"></div>
            </div>
            <div className="h-64 bg-zinc-100 rounded-[2.5rem]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="pt-32 pb-20 px-4 text-center min-h-screen">
        <h2 className="text-3xl font-black mb-4">Property Not Found</h2>
        <button onClick={() => navigate('/')} className="text-brand-600 font-bold hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  let images: string[] = [];
  try {
    const parsed = JSON.parse(listing.image);
    if (Array.isArray(parsed)) {
      images = parsed;
    } else {
      images = [listing.image];
    }
  } catch (e) {
    images = [listing.image];
  }

  const amenities = (listing.amenities || '').split(',').filter(Boolean).map(a => a.trim());

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      alert('Please switch to a Student role to book.');
      return;
    }
    navigate(`/book/${listing.id}`);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-zinc-500 hover:text-zinc-900 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 h-[50vh] min-h-[400px]">
        {images.length > 0 ? (
          <>
            <div className="lg:col-span-2 row-span-2 relative rounded-[2.5rem] overflow-hidden">
              <img src={images[0]} alt={listing.name} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-brand-700 rounded-xl shadow-sm">
                  {listing.type}
                </span>
                {listing.gender && (
                  <span className="px-4 py-2 bg-blue-50/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-blue-700 rounded-xl shadow-sm">
                    {listing.gender === 'male' ? 'Boys' : listing.gender === 'female' ? 'Girls' : 'Unisex'}
                  </span>
                )}
              </div>
            </div>
            {images.slice(1, 4).map((img, idx) => (
              <div key={idx} className="relative rounded-[2rem] overflow-hidden">
                <img src={img} alt={`${listing.name} ${idx + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </>
        ) : (
          <div className="lg:col-span-4 row-span-2 bg-zinc-100 rounded-[2.5rem] flex items-center justify-center">
            <span className="text-zinc-400 font-bold">No Image Available</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">{listing.name}</h1>
          <div className="flex items-center text-zinc-400 font-bold uppercase tracking-wider mb-8">
            <MapPin className="w-5 h-5 mr-2 text-brand-500" />
            {listing.location}
          </div>

          <div className="prose prose-zinc max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-4">About this property</h2>
            <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">What this place offers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {amenities.map((amenity, i) => (
                <div key={i} className="flex items-center space-x-3 text-zinc-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div>
          <div className="sticky top-32 p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-premium">
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-black text-zinc-900">₹{listing.price}</span>
              <span className="text-zinc-500 font-bold ml-2">/ month</span>
            </div>

            <div className="space-y-4">
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
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  setIsChatOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Owner</span>
              </button>

              <AnimatePresence mode="wait">
                {!showNumber ? (
                  <motion.button
                    key="contact-btn"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowNumber(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Reveal Number</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="number-reveal"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-zinc-900 text-white px-6 py-4 rounded-2xl border border-zinc-800"
                  >
                    <div className="text-lg font-black tracking-widest">
                      {listing.contact}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(listing.contact);
                        alert('Number copied to clipboard! 🚀');
                      }}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-6 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
              No booking fees on Basera
            </div>
          </div>
        </div>
      </div>
      {/* ChatBox Modal */}
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
