import React, { useState } from 'react';
import { MapPin, Compass, Navigation, ShoppingBag, Coffee, Bus, BookOpen, Star, Phone, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
    {
        id: 'essentials',
        name: 'Daily Needs',
        icon: ShoppingBag,
        description: 'Supermarkets, pharmacies, and ATMs',
        places: [
            { name: 'Koni Supermart', desc: 'All groceries and daily needs under one roof.', distance: '1.2 km', rating: 4.5, type: 'Grocery' },
            { name: 'Apollo Pharmacy', desc: '24/7 Medical store with home delivery.', distance: '2.0 km', rating: 4.9, type: 'Medical' },
            { name: 'SBI ATM & Branch', desc: 'Main branch with multiple ATMs.', distance: '0.5 km', rating: 4.2, type: 'Bank' }
        ]
    },
    {
        id: 'food',
        name: 'Food & Cafes',
        icon: Coffee,
        description: 'Best spots for a quick bite or late-night cravings',
        places: [
            { name: 'The Study Cafe', desc: 'Free WiFi, great coffee, and peaceful environment.', distance: '0.8 km', rating: 4.7, type: 'Cafe' },
            { name: 'Highway Dhaba', desc: 'Late night parathas and authentic meals.', distance: '3.5 km', rating: 4.4, type: 'Dhaba' },
            { name: 'Birkona Chaat Corner', desc: 'Famous for evening snacks and fast food.', distance: '1.5 km', rating: 4.6, type: 'Street Food' }
        ]
    },
    {
        id: 'academic',
        name: 'Academic',
        icon: BookOpen,
        description: 'Stationery, print shops, and libraries',
        places: [
            { name: 'Student Stationers', desc: 'Books, cheap printouts, and project supplies.', distance: '0.4 km', rating: 4.8, type: 'Stationery' },
            { name: 'Central Library', desc: 'University library open for all students.', distance: '0.1 km', rating: 4.9, type: 'Library' },
            { name: 'Tech Print House', desc: 'Bulk printing and spiral binding.', distance: '0.6 km', rating: 4.5, type: 'Print Shop' }
        ]
    },
    {
        id: 'transport',
        name: 'Transport',
        icon: Bus,
        description: 'Bus stops and auto stands',
        places: [
            { name: 'Koni Main Bus Stand', desc: 'City buses to railway station and main market.', distance: '1.0 km', rating: 4.0, type: 'Bus Stop' },
            { name: 'University Auto Stand', desc: 'Shared autos available 24/7 right outside campus.', distance: '0.2 km', rating: 4.2, type: 'Auto Stand' },
            { name: 'City Railway Station', desc: 'Main junction for long distance travel.', distance: '8.5 km', rating: 4.1, type: 'Railway' }
        ]
    }
];

export default function KoniGuide() {
    const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 border border-brand-100 text-brand-700 rounded-3xl mb-8 shadow-sm"
                >
                    <Compass className="w-10 h-10" />
                </motion.div>
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6"
                >
                    The Ultimate <span className="text-brand-600">Koni Guide.</span>
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-500 text-lg font-medium leading-relaxed"
                >
                    Your digital compass to student life in Bilaspur. From essential shops to the best hangout spots right around your campus.
                </motion.p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                            activeTab === cat.id
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 scale-105'
                                : 'bg-white text-zinc-500 hover:bg-zinc-50 border border-zinc-100'
                        }`}
                    >
                        <cat.icon className="w-5 h-5" />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Active Category Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 border border-zinc-100 shadow-premium"
                >
                    {CATEGORIES.map(cat => cat.id === activeTab && (
                        <div key={cat.id}>
                            <div className="flex items-center space-x-4 mb-10 pb-8 border-b border-zinc-100">
                                <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl">
                                    <cat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-zinc-900">{cat.name}</h2>
                                    <p className="text-zinc-500 font-medium">{cat.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cat.places.map((place, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        className="group p-6 rounded-[2rem] border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-brand-200 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="px-3 py-1 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-colors">
                                                {place.type}
                                            </span>
                                            <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                                <Star className="w-3.5 h-3.5 mr-1 fill-emerald-600" />
                                                {place.rating}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-2">{place.name}</h3>
                                        <p className="text-zinc-500 text-sm mb-6 leading-relaxed line-clamp-2">
                                            {place.desc}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50">
                                            <div className="flex items-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
                                                {place.distance}
                                            </div>
                                            <button className="text-brand-600 hover:text-brand-700 p-2 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Emergency Contacts Banner */}
            <div className="mt-12 bg-zinc-900 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[100px] rounded-full point-events-none group-hover:bg-red-500/30 transition-colors duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Emergency Contacts</h3>
                            <p className="text-zinc-400">Keep these numbers handy for any immediate assistance.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-sm">
                            <div className="text-red-400 font-black text-xl mb-1">100</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Police</div>
                        </div>
                        <div className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-sm">
                            <div className="text-red-400 font-black text-xl mb-1">108</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Ambulance</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
