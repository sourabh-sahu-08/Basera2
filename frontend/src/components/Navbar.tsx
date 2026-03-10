import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Info, Menu, X, LayoutDashboard, User as UserIcon, ChevronDown, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, setUser } = useUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Housing', icon: Home },
    { to: '/messes', label: 'Eats', icon: Utensils },
    { to: '/about', label: 'Guide', icon: Info },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 px-4 py-3 glass-card rounded-3xl">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200"
          >
            <Sparkles className="text-white w-5 h-5" />
          </motion.div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-900">Basera</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center bg-zinc-100/50 p-1.5 rounded-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-6 py-2 text-sm font-bold transition-all ${isActive(link.to) ? 'text-brand-700' : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              {isActive(link.to) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm z-0"
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-white/50 border border-white/80 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-white transition-all shadow-sm group"
              >
                <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center overflow-hidden border border-brand-100 transition-colors group-hover:bg-brand-100">
                  <UserIcon className="w-4 h-4 text-brand-600" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[9px] font-black text-brand-600/50 uppercase leading-none">{user.role}</div>
                  <div className="text-xs font-bold text-zinc-900 leading-tight">{user.full_name.split(' ')[0]}</div>
                </div>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-premium p-2 z-50"
                  >
                    <div className="px-5 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-2">
                      Account Dashboard
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-zinc-900 font-bold hover:bg-brand-50 hover:text-brand-700 rounded-2xl transition-colors"
                    >
                      <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="w-4 h-4 text-brand-500" />
                      </div>
                      <span>My Workspace</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <div className="w-8 h-8 bg-red-50/50 rounded-xl flex items-center justify-center">
                        <X className="w-4 h-4" />
                      </div>
                      <span>Logout Account</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary flex items-center space-x-2 py-2.5 px-6 !rounded-2xl"
            >
              <span>Login</span>
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 bg-zinc-100 rounded-2xl text-zinc-900 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 p-4 rounded-2xl text-base font-bold transition-all ${isActive(link.to) ? 'bg-brand-50 text-brand-700' : 'text-zinc-500 hover:bg-zinc-50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive(link.to) ? 'bg-white shadow-sm' : 'bg-zinc-100'}`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
