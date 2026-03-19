import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Messes from './pages/Messes';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Roomies from './pages/Roomies';
import RentLogs from './pages/RentLogs';
import KoniGuide from './pages/KoniGuide';
import BookingPage from './pages/BookingPage';
import ListingDetails from './pages/ListingDetails';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/messes" element={<Messes />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/property/:id" element={<ListingDetails />} />
              <Route path="/roomies" element={<Roomies />} />
              <Route path="/rent-logs" element={<RentLogs />} />
              <Route path="/guide" element={<KoniGuide />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-zinc-100 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Basera</span>
              </div>
              <p className="text-zinc-400 text-sm">
                Made with ❤️ for the students of Koni, Bilaspur.
              </p>
              <div className="mt-6 text-[10px] text-zinc-300 uppercase font-bold tracking-[0.2em]">
                © 2026 Basera Housing Portal
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
}
