import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCategory } from '../types';
import { ServiceCard } from './ServiceCard';
import {
  PhoneCall,
  Bot,
  ShieldCheck,
  Zap,
  Sparkles,
  Clock,
  CheckCircle2,
  Loader2,
  Headphones,
} from 'lucide-react';

interface LandingPageProps {
  onStartCall: (servicePreset?: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const SERVICES: ServiceCategory[] = [
  {
    id: 'plumber',
    name: 'Plumber',
    iconName: 'Wrench',
    description: 'Fix leaks, pipe fits, tap replacements, and bathroom drainage.',
    color: '#2563EB',
    badge: '24/7 Fast',
    popularServices: ['Pipe Leakage', 'Tap Fitting', 'Drainage'],
  },
  {
    id: 'electrician',
    name: 'Electrician',
    iconName: 'Zap',
    description: 'Wiring repair, MCB replacement, fan/light installation.',
    color: '#F59E0B',
    badge: 'Certified',
    popularServices: ['Short Circuit', 'MCB Switch', 'Fan Fitting'],
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    iconName: 'Hammer',
    description: 'Furniture assembly, door lock repair, cabinet crafting.',
    color: '#F97316',
    popularServices: ['Door Lock', 'Furniture Repair', 'Modular Kitchen'],
  },
  {
    id: 'labour',
    name: 'Labour',
    iconName: 'HardHat',
    description: 'Manual assistance for moving, loading, heavy lifting & masonry.',
    color: '#10B981',
    popularServices: ['House Shifting', 'Material Handling', 'Helper'],
  },
  {
    id: 'painter',
    name: 'Painter',
    iconName: 'Paintbrush',
    description: 'Full house interior/exterior wall painting and waterproofing.',
    color: '#A855F7',
    badge: 'Popular',
    popularServices: ['Full Home Paint', 'Waterproofing', 'Wall Touchup'],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    iconName: 'Sparkles',
    description: 'Deep home cleaning, sofa/carpet shampooing, kitchen sanitizing.',
    color: '#14B8A6',
    popularServices: ['Deep Cleaning', 'Sofa Washing', 'Bathroom Sanitization'],
  },
  {
    id: 'ac-repair',
    name: 'AC Repair',
    iconName: 'Snowflake',
    description: 'Air conditioner servicing, gas refill, PCB repair & installation.',
    color: '#0EA5E9',
    badge: 'Summer Special',
    popularServices: ['AC Servicing', 'Gas Leakage', 'AC Installation'],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCall,
  isLoading,
  errorMessage,
}) => {
  return (
    <div className="min-h-screen bg-[#080500] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-950/80">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400">
              Doobee
            </span>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block -mt-1">
              AI VOICE ASSISTANT
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            AI Voice Live Support
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16 z-10 flex-1 flex flex-col items-center">
        {/* Badge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 backdrop-blur-md shadow-md text-center"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />
          <span>Next-Gen Voice-Activated Home Services</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-center tracking-tight leading-[1.1] max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400"
        >
          Doobee
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-2xl text-amber-200/90 font-medium text-center mt-2 sm:mt-3 max-w-2xl leading-snug"
        >
          Book Trusted Home Service Professionals with AI
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-xs sm:text-sm text-amber-200/70 text-center mt-2 max-w-lg"
        >
          Speak naturally in English, Hindi or Hinglish. Doobee AI instantly understands your problem and assigns verified service experts.
        </motion.p>

        {/* Large Primary Action Call Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 mb-8 sm:mb-12 flex flex-col items-center w-full max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onStartCall()}
            disabled={isLoading}
            className="w-full sm:w-auto relative group px-6 sm:px-10 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-extrabold text-lg sm:text-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-400/60 border border-amber-300/40 transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-black" />
                <span>Creating AI Session...</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
                  <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 text-black fill-current" />
                </div>
                <span>📞 Call Doobee AI</span>
              </>
            )}

            {/* Glowing ring animation */}
            <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-400 opacity-30 group-hover:opacity-60 blur-lg transition-all duration-300 pointer-events-none -z-10" />
          </motion.button>

          {/* Error Message Toast Banner if any */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              {errorMessage}
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-[11px] sm:text-xs text-amber-200/70">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Instant Connection
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Multilingual Support
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> No Registration
            </span>
          </div>
        </motion.div>

        {/* Services Grid Section Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              Select a Service to Speak With AI
            </h2>
            <p className="text-xs text-amber-200/60">
              Click any card to start a voice call targeted for that specific service.
            </p>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={(name) => onStartCall(name)}
            />
          ))}
        </div>

        {/* Features Highlights */}
        <div className="w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-amber-500/20">
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-300">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm">Real-time Voice AI</h4>
              <p className="text-xs text-amber-200/60 mt-1">
                Zero lag natural conversation with instant speech synthesis.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm">Verified Professionals</h4>
              <p className="text-xs text-amber-200/60 mt-1">
                Background-checked plumbers, electricians, painters & experts.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-300">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm">Instant Dispatch</h4>
              <p className="text-xs text-amber-200/60 mt-1">
                Workers matched and assigned to your location within minutes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-500/20 py-6 text-center text-xs text-amber-200/50 z-10">
        <p>© 2026 Doobee AI Voice Assistant — Powered by LiveKit & Hugging Face</p>
      </footer>
    </div>
  );
};
