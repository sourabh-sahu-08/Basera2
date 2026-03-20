import React, { useState } from 'react';
import { Mess } from '../types';
import { MapPin, Phone, UtensilsCrossed, Check, Sparkles, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Props {
  mess: Mess;
}

export default function MessCard({ mess }: Props) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const TODAY = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  // Parse weekly menu JSON
  let menuObj: Record<string, string> = {};
  try {
    const parsed = JSON.parse(mess.menu);
    menuObj = typeof parsed === 'object' && parsed !== null ? parsed : { monday: mess.menu };
  } catch {
    menuObj = { monday: mess.menu };
  }
  const todayMenu = menuObj[TODAY] || "Chef's Special";

  // Process image path
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80';
  const processImg = (img: string) => {
    if (!img || img === 'undefined' || img === '/uploads/') return FALLBACK_IMAGE;
    if (!img.startsWith('http') && !img.startsWith('/')) return '/uploads/' + img;
    return img;
  };
  let displayImage = mess.image;
  try {
    const parsed = JSON.parse(mess.image);
    displayImage = Array.isArray(parsed) && parsed.length > 0 ? processImg(parsed[0]) : processImg(String(parsed));
  } catch {
    displayImage = processImg(mess.image);
  }
  if (!displayImage || displayImage === FALLBACK_IMAGE) displayImage = FALLBACK_IMAGE;

  const handleSubscribe = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { alert('Please switch to a Student role to subscribe.'); return; }
    try {
      const data = await api.createSubscription(user.id, mess.id);
      if (data.id) setIsSubscribed(true);
    } catch (err) { console.error(err); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] p-4 border border-zinc-100 shadow-premium group transition-all duration-500 hover:border-orange-100"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-64 rounded-[2rem] overflow-hidden shrink-0 relative">
          <img
            src={displayImage}
            alt={mess.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50 shadow-sm flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">Top Rated</span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-3xl font-extrabold text-zinc-900 group-hover:text-orange-600 transition-colors tracking-tight">{mess.name}</h3>
              <div className="flex items-center text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">
                <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                {mess.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-zinc-900">₹{mess.price_per_month}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-1">Monthly Subscription</div>
            </div>
          </div>

          <p className="text-zinc-500 text-base mb-6 leading-relaxed font-medium italic pr-4">
            "{mess.description}"
          </p>

          {/* Weekly Menu Block */}
          <div className="bg-orange-50/50 rounded-2xl p-5 mb-4 border border-orange-100/30 group-hover:bg-orange-50 transition-colors">
            <div className="flex items-center text-orange-700 text-[10px] font-black uppercase tracking-widest mb-2">
              <UtensilsCrossed className="w-3.5 h-3.5 mr-2" />
              Today's Special — <span className="capitalize ml-1">{TODAY}</span>
            </div>
            <p className="text-zinc-900 text-base font-bold leading-relaxed px-1 mb-4">
              {todayMenu}
            </p>

            <button
              onClick={() => setShowWeekly(v => !v)}
              className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-800 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              {showWeekly ? 'Hide' : 'View'} Weekly Schedule
              {showWeekly ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showWeekly && (
              <div className="mt-3 space-y-1.5 border-t border-orange-100 pt-3">
                {DAYS.map(day => (
                  <div key={day} className={`flex items-start gap-3 p-2 rounded-xl ${day === TODAY ? 'bg-orange-100 border border-orange-200' : ''}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest w-10 shrink-0 mt-0.5 ${day === TODAY ? 'text-orange-600' : 'text-orange-400'}`}>{day.slice(0,3)}</span>
                    <span className={`text-xs leading-snug ${day === TODAY ? 'font-bold text-orange-900' : 'text-zinc-500'}`}>{menuObj[day] || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={() => {
                const win = window.open(`tel:${mess.contact}`, '_self');
                if (!win) alert(`Mess Contact: ${mess.contact}`);
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Chef</span>
            </button>
            <button
              onClick={handleSubscribe}
              disabled={isSubscribed}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isSubscribed
                  ? 'bg-brand-50 text-brand-700'
                  : 'bg-accent-600 text-white shadow-xl shadow-orange-100 hover:bg-orange-700'
                }`}
            >
              {isSubscribed ? <Check className="w-4 h-4" /> : <UtensilsCrossed className="w-4 h-4" />}
              <span>{isSubscribed ? 'Member' : 'Get Membership'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
