import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertTriangle, MessageCircle, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { Message, User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  receiverId: number;
  receiverName: string;
  listingId?: number; // Added to match origin API
}

export default function ChatDialog({ isOpen, onClose, receiverId, receiverName, listingId }: Props) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user && listingId !== undefined) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3s
      return () => clearInterval(interval);
    }
  }, [isOpen, receiverId, listingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!user || listingId === undefined) return;
    try {
      const data = await api.fetchMessages(listingId, user.id, receiverId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || listingId === undefined) return;

    setLoading(true);
    try {
      const res = await api.sendMessage(listingId, user.id, receiverId, newMessage);
      if (res && res.content) {  // Fallback to updating immediately if backend returns the new message block
        // Re-fetch to guarantee sync with DB, or optimistically push string.
        fetchMessages();
        setNewMessage('');
      } else if (res.success && res.message) {
        setMessages([...messages, res.message]);
        setNewMessage('');
      } else {
         fetchMessages();
         setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col h-[600px] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900">{receiverName}</h3>
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Contact
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Start a conversation</p>
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id}
                className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                    m.sender_id === user?.id 
                      ? 'bg-zinc-900 text-white rounded-tr-none' 
                      : 'bg-white text-zinc-900 rounded-tl-none border border-zinc-100'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fraud Banner */}
        <div className="px-6 py-3 bg-red-50 border-t border-red-100 flex items-center text-[10px] font-bold text-red-600">
          <AlertTriangle className="w-4 h-4 mr-2" />
          DO NOT share personal numbers or pay outside the platform to avoid fraud.
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-zinc-100 flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium text-zinc-900"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
