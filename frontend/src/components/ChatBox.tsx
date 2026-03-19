import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User } from 'lucide-react';
import { api } from '../services/api';
import { Message } from '../types';

interface ChatBoxProps {
  listingId: number;
  currentUserId: number;
  targetUserId: number; // The owner ID
  targetUserName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBox({ listingId, currentUserId, targetUserId, targetUserName, isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.fetchMessages(listingId, currentUserId, targetUserId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    // Initial fetch
    fetchMessages();
    setLoading(false);

    // Setup polling every 2 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, listingId, currentUserId, targetUserId]);

  useEffect(() => {
    // Auto scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      // Optimistic UI update
      const tempMsg: Message = {
        id: Date.now(),
        listing_id: listingId,
        sender_id: currentUserId,
        receiver_id: targetUserId,
        content: inputText.trim(),
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setInputText('');

      await api.sendMessage(listingId, currentUserId, targetUserId, tempMsg.content);
      // Fetch latest reliably without waiting for next poll
      fetchMessages();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col z-50 overflow-hidden"
          style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Header */}
          <div className="bg-zinc-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{targetUserName}</h3>
                <p className="text-xs text-zinc-400">Property Owner</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 bg-zinc-50 flex flex-col gap-3">
            {messages.length === 0 && !loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 text-sm text-center px-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-zinc-300" />
                </div>
                Send a message to start chatting directly with the owner!
              </div>
            ) : null}

            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMine 
                      ? 'bg-zinc-900 text-white rounded-br-sm' 
                      : 'bg-white text-zinc-800 border border-zinc-100 rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap word-break">{msg.content}</p>
                    <span className={`text-[10px] mt-1 block ${isMine ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-zinc-100">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about rent, facilities..."
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
