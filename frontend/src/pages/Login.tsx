import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, ShieldCheck, GraduationCap, ChefHat, ArrowRight, Lock, Mail, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'student' | 'owner' | 'mess_owner'>('student');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: GraduationCap,
      activeClass: 'border-blue-500 bg-blue-50/50 text-blue-700',
      inactiveClass: 'border-zinc-200 bg-white text-zinc-500 hover:border-blue-200 hover:bg-blue-50/30'
    },
    {
      id: 'owner',
      title: 'Owner',
      icon: ShieldCheck,
      activeClass: 'border-emerald-500 bg-emerald-50/50 text-emerald-700',
      inactiveClass: 'border-zinc-200 bg-white text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50/30'
    },
    {
      id: 'mess_owner',
      title: 'Mess',
      icon: ChefHat,
      activeClass: 'border-orange-500 bg-orange-50/50 text-orange-700',
      inactiveClass: 'border-zinc-200 bg-white text-zinc-500 hover:border-orange-200 hover:bg-orange-50/30'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ username: formData.username, password: formData.password });
        if (res.success && res.user) {
          setUser(res.user);
          navigate('/dashboard');
        } else {
          setError(res.error || 'Invalid credentials');
        }
      } else {
        if (!formData.full_name) {
          setError('Full name is required for signup');
          setLoading(false);
          return;
        }
        const res = await api.signup({
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          role: selectedRole
        });
        if (res.success && res.user) {
          setUser(res.user);
          navigate('/dashboard');
        } else {
          setError(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 bg-brand-500/10 blur-[100px] rounded-full -z-10" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 text-white rounded-3xl mb-6 shadow-xl shadow-brand-500/30">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 mb-3">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-zinc-500 font-medium">
            {isLogin ? 'Enter your details to access your dashboard' : 'Join Basera to find or list premium properties'}
          </p>
        </div>

        <motion.div
          layout
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-premium"
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700 px-1">I am a...</label>
                    <div className="grid grid-cols-3 gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id as any)}
                          className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all ${selectedRole === role.id ? role.activeClass : role.inactiveClass
                            }`}
                        >
                          <role.icon className="w-5 h-5 mb-1" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">{role.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-zinc-700 px-1">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                      <input
                        type="text"
                        name="full_name"
                        required={!isLogin}
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 px-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="student123"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-zinc-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-zinc-900"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:pointer-events-none mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-brand-600 font-bold hover:underline underline-offset-4 ml-1"
              >
                {isLogin ? 'Create one' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
