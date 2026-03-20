import React, { useState } from 'react';
import { Listing } from '../types';
import { MapPin, Info, CheckCircle2, BookmarkPlus, Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const amenities = (listing.amenities || '').split(',').filter(Boolean).map(a => a.trim());
  const [showNumber, setShowNumber] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const processImg = (img: string) => {
    if (!img) return img;
    if (!img.startsWith('http') && !img.startsWith('/')) return '/uploads/' + img;
    return img;
  };

  let displayImage = listing.image;
  try {
    const parsed = JSON.parse(listing.image);
    if (Array.isArray(parsed) && parsed.length > 0) {
      displayImage = processImg(parsed[0]);
    } else {
      displayImage = processImg(String(parsed));
    }
  } catch (e) {
    displayImage = processImg(listing.image);
  }

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

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/property/${listing.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-premium transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={displayImage}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-5 left-5 flex gap-2">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-brand-700 rounded-xl shadow-sm border border-white/50">
            {listing.type}
          </span>
          {listing.gender && (
            <span className="px-3 py-1.5 bg-blue-50/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-700 rounded-xl shadow-sm border border-blue-100">
              {listing.gender === 'male' ? 'Boys' : listing.gender === 'female' ? 'Girls' : 'Unisex'}
            </span>
          )}
          <span className="px-3 py-1.5 bg-zinc-900/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-sm border border-white/10">
            Verified
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-md text-zinc-900 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
        >
          <ArrowUpRight className="w-5 h-5" />
        </motion.div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-end justify-between">
            <div className="bg-brand-600 text-white px-4 py-2 rounded-2xl font-black shadow-2xl text-lg flex items-baseline">
              ₹{listing.price}
              <span className="text-[10px] font-bold opacity-60 ml-1">/mo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-extrabold text-zinc-900 mb-2 group-hover:text-brand-600 transition-colors">{listing.name}</h3>
        <div className="flex items-center text-zinc-400 text-xs font-bold uppercase tracking-wider mb-5">
          <MapPin className="w-4 h-4 mr-1 text-brand-500" />
          {listing.location}
        </div>

        <p className="text-zinc-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {amenities.slice(0, 3).map((amenity, i) => (
            <span key={i} className="flex items-center text-[10px] font-black uppercase tracking-tighter text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
              <CheckCircle2 className="w-3 h-3 mr-1.5 text-brand-500" />
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="text-[10px] font-black text-zinc-300 py-1.5 ml-1">+{amenities.length - 3}</span>
          )}
        </div>

        <div className="mt-auto flex gap-3">
          <div className="flex-1">
            <button
              onClick={() => navigate(`/property/${listing.id}`)}
              className="w-full flex items-center justify-center space-x-2 bg-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>

          <button
            onClick={handleBookClick}
            disabled={isBooked}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isBooked
                ? 'bg-brand-50 text-brand-700 pointer-events-none'
                : 'bg-brand-600 text-white shadow-xl shadow-brand-100 hover:bg-brand-700'
              }`}
          >
            {isBooked ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            <span>{isBooked ? 'Locked' : 'Book'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
