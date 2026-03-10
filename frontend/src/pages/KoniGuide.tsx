import React from 'react';
import { MapPin, Compass, Navigation } from 'lucide-react';

export default function KoniGuide() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 border border-brand-100 text-brand-700 rounded-3xl mb-8 shadow-sm">
                    <MapPin className="w-10 h-10" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
                    The Ultimate <span className="text-brand-600">Koni Guide.</span>
                </h1>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                    Your digital compass to student life in Bilaspur. From essential shops to the best hangout spots around campus.
                </p>
            </div>

            <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-16 text-white text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-brand-500/20 blur-[100px] rounded-full point-events-none" />

                <div className="relative z-10">
                    <Compass className="w-16 h-16 text-brand-500 mx-auto mb-8 animate-[spin_10s_linear_infinite]" />
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4">We're Mapping the Area</h2>
                    <p className="text-zinc-400 max-w-lg mx-auto mb-8 font-medium line-relaxed">
                        Our team is busy curating the best local spots, trusted vendors, and essential services specifically for students in Koni.
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-bold tracking-widest uppercase text-brand-300">
                        <Navigation className="w-4 h-4 mr-2" />
                        Launching Next Semester
                    </div>
                </div>
            </div>
        </div>
    );
}
