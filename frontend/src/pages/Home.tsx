import React, { useEffect, useState } from 'react';
import { Listing } from '../types';
import ListingCard from '../components/ListingCard';
import { Search, Map, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.fetchAllListings()
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  const filteredListings = listings.filter(l => {
    const matchesFilter = filter === 'all' || l.type === filter;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-500/10 blur-[120px] rounded-full -z-10" />

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-brand-50 border border-brand-100/50 text-brand-700 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Your Perfect Stay</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-extrabold text-zinc-900 tracking-tightest mb-8 leading-[0.9]"
          >
            Find your <span className="text-brand-600 relative">Basera<motion.span initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.8 }} className="absolute bottom-2 left-0 h-3 bg-brand-500/20 -z-10 rounded-full" /></span> <br />
            <span className="text-zinc-400">near Bilaspur.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            The premium student housing network for GGU.
            Verified PGs, Hostels, and Flats designed for modern living.
          </motion.p>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto p-2 glass-card rounded-[2.5rem] shadow-premium"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Where would you like to live?"
                  className="w-full pl-16 pr-4 py-5 bg-transparent focus:outline-none text-zinc-900 font-bold text-lg placeholder:text-zinc-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="h-10 w-[1px] bg-zinc-100 hidden md:block mx-2"></div>

              <div className="flex items-center gap-1.5 p-1 bg-zinc-50/50 rounded-3xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {['all', 'pg', 'hostel', 'flat'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${filter === type
                      ? 'bg-zinc-900 text-white shadow-xl'
                      : 'text-zinc-400 hover:text-zinc-900 hover:bg-white'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">Featured Spaces</h2>
          <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest mt-1">Available near GGU Campus</p>
        </div>
        <a
          href="https://www.google.com/maps/search/PGs+and+Hostels+in+Koni,+Bilaspur"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-brand-600 font-black text-sm hover:underline cursor-pointer"
        >
          <Map className="w-4 h-4" />
          <span>View Map</span>
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[450px] bg-white rounded-[2.5rem] animate-pulse border border-zinc-100"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {filteredListings.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-white rounded-[3rem] border border-zinc-100 shadow-sm"
        >
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Map className="w-10 h-10 text-zinc-200" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900">No properties match your hunt</h3>
          <p className="text-zinc-400 font-medium">Try broadening your search or switching categories.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilter('all'); }}
            className="mt-8 btn-primary"
          >
            Show All Properties
          </button>
        </motion.div>
      )}
    </div>
  );
}
