import React, { useEffect, useState } from 'react';
import { Mess } from '../types';
import MessCard from '../components/MessCard';
import { Utensils, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export default function Messes() {
  const [messes, setMesses] = useState<Mess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchMesses()
      .then(data => {
        setMesses(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-16 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-600/10 blur-[80px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-100/50 text-orange-700 text-xs font-black uppercase tracking-widest mb-6"
        >
          <Utensils className="w-4 h-4" />
          <span>Homestyle Meals</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tightest mb-6 leading-tight">
          Student <span className="text-accent-600">Messes.</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
          Hungry? Find the best tiffin services in Koni.
          Verified home-cooked meals starting from <span className="text-zinc-900 font-bold">₹2000/month.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-zinc-100 shadow-sm"></div>
          ))
        ) : (
          messes.map(mess => (
            <MessCard key={mess.id} mess={mess} />
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 glass-card rounded-[3rem] p-10 relative overflow-hidden group"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-brand-600 text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 bg-brand-50 w-fit rounded-full border border-brand-100">
            <Sparkles className="w-3 h-3" />
            <span>Insider Knowledge</span>
          </div>
          <h3 className="text-3xl font-extrabold text-zinc-900 mb-4 tracking-tight">Monthly Subscription vs Daily</h3>
          <p className="text-zinc-500 font-medium leading-relaxed mb-8 max-w-2xl">
            Most messes in Koni offer a significant discount if you opt for a monthly subscription.
            <span className="text-zinc-800 font-bold"> Always ask for a "Trial Meal" </span> before committing to a full month.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl text-sm font-black text-zinc-900 shadow-sm border border-zinc-100 flex items-center space-x-2">
              <span className="w-2 h-2 bg-brand-500 rounded-full" />
              <span>Avg: ₹2200 - ₹2800</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl text-sm font-black text-zinc-900 shadow-sm border border-zinc-100 flex items-center space-x-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full" />
              <span>Sunday Specials</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/5 blur-[100px] rounded-full group-hover:bg-brand-500/10 transition-colors duration-700"></div>
      </motion.div>
    </div>
  );
}
