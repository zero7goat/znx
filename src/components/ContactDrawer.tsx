import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Copy, Check, ArrowUpRight, Mail, MapPin, Calendar } from 'lucide-react';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '$10k - $25k',
    message: '',
  });

  const studioEmail = 'contactmeznx@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(studioEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-xl bg-[#0a0a0a] border-l border-slate-800 text-white p-8 sm:p-12 overflow-y-auto flex flex-col justify-between shadow-2xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono-tech text-red-500 uppercase tracking-widest block mb-1">
                    START A MONUMENT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-syne font-bold">LET'S TALK</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Calendly Booking Link Card */}
              <a
                href="https://calendly.com/contactmeznx/project-call"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-600 hover:to-red-700 border border-red-500/60 rounded-xl flex items-center justify-between mb-4 text-white transition-all shadow-xl group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tech text-red-100 uppercase tracking-wider block font-semibold">
                      SCHEDULE A 1-ON-1 CALL
                    </span>
                    <span className="text-sm font-syne font-bold uppercase tracking-wide">
                      BOOK ON CALENDLY
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Direct Email Card */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-500" />
                  <div>
                    <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider block">
                      DIRECT EMAIL
                    </span>
                    <span className="text-sm font-mono-tech text-white font-medium">
                      {studioEmail}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Form */}
              {submitted ? (
                <div className="py-16 text-center flex flex-col items-center gap-4 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-syne font-bold">INQUIRY TRANSMITTED</h3>
                  <p className="text-xs font-mono-tech text-slate-400 max-w-xs uppercase">
                    WE HAVE RECEIVED YOUR BRIEF AND WILL RESPOND WITHIN 24 HOURS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest block mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest block mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest block mb-2">
                      ESTIMATED BUDGET
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['$5k - $10k', '$10k - $25k', '$25k+'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: b })}
                          className={`py-2 px-3 text-xs font-mono-tech rounded-lg border text-center transition-all ${
                            formData.budget === b
                              ? 'bg-red-950/50 border-red-500 text-white font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest block mb-2">
                      PROJECT BRIEF *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your vision, scope, and target launch timeline..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full py-4 bg-white text-black font-syne font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    <span>TRANSMIT BRIEF</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Footer Location Details */}
            <div className="mt-12 pt-6 border-t border-slate-800 text-[11px] font-mono-tech text-slate-500 uppercase flex justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                NEW YORK • LONDON • TOKYO
              </span>
              <span>EST. 2024</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
