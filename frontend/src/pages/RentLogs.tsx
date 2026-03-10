import React from 'react';
import { Calendar, Receipt, Clock } from 'lucide-react';

export default function RentLogs() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-3xl mb-8 shadow-sm">
                    <Calendar className="w-10 h-10" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-6">
                    Track Your <span className="text-emerald-600">Rent Logs.</span>
                </h1>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                    Never miss a payment or misplace a receipt again. A comprehensive view of your housing expenses is coming soon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Receipt, title: "Automated Receipts", desc: "Digital records of every payment made." },
                    { icon: Clock, title: "Payment Reminders", desc: "Stay on top of due dates effortlessly." },
                    { icon: Calendar, title: "Historical Tracking", desc: "View your entire payment history in one place." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-premium opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-not-allowed">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center mb-6">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">{feature.title}</h3>
                        <p className="text-zinc-500 font-medium">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
