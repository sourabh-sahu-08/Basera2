import React from 'react';
import { MapPin, Info, GraduationCap, Bus } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const landmarks = [
    { name: 'Guru Ghasidas Vishwavidyalaya (GGU)', type: 'University', distance: '0.5 km' },
    { name: 'Government Engineering College', type: 'College', distance: '1.2 km' },
    { name: 'Koni Main Market', type: 'Shopping', distance: '0.2 km' },
    { name: 'Bilaspur Railway Station', type: 'Transport', distance: '8.5 km' },
    { name: 'Science College', type: 'College', distance: '0.8 km' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-5xl font-black text-zinc-900 mb-6">Living in Koni</h1>
        <p className="text-zinc-600 text-lg leading-relaxed mb-8">
          Koni is the educational hub of Bilaspur, Chhattisgarh. Home to the prestigious Guru Ghasidas Vishwavidyalaya (Central University), 
          it's a vibrant area bustling with students from all over India.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Student Friendly</h3>
            <p className="text-emerald-800/70 text-sm">
              Everything in Koni is designed for students—from affordable xerox shops to late-night tea stalls.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Bus className="text-white w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Connectivity</h3>
            <p className="text-blue-800/70 text-sm">
              Well connected to Bilaspur city via City Bus and Auto-rickshaws. Ratanpur and Birkona are nearby.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
          Key Landmarks & Distances
        </h2>
        <div className="space-y-4">
          {landmarks.map((landmark, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-emerald-200 transition-colors">
              <div>
                <div className="font-bold text-zinc-900">{landmark.name}</div>
                <div className="text-xs text-zinc-400 uppercase font-bold tracking-wider">{landmark.type}</div>
              </div>
              <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {landmark.distance}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
        <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-zinc-400" />
          Important Tips for New Students
        </h3>
        <ul className="space-y-3 text-zinc-600 text-sm">
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
            Always check for 24/7 water supply as summers can be harsh in Bilaspur.
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
            Confirm if the electricity bill is included in the rent or separate.
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-3 shrink-0"></span>
            Most PGs have a strict curfew around 10:00 PM.
          </li>
        </ul>
      </div>
    </div>
  );
}
