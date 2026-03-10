import React from 'react';
import { Users, Search, ArrowRight } from 'lucide-react';

export default function Roomies() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-3xl mb-8 shadow-sm">
                    <Users className="w-10 h-10" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
                    Find Your Perfect <span className="text-indigo-600">Roomie.</span>
                </h1>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-12">
                    We're building a smarter way to connect with students who share your lifestyle and preferences. Finding a flatmate in Bilaspur is about to get a whole lot easier.
                </p>

                <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-premium relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-br-[5rem] -ml-16 -mt-16 z-0" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-2xl font-black text-zinc-900">Coming Soon</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email to get early access..."
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg">
                                Notify Me
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
