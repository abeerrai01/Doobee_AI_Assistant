import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Sparkles,
  PhoneCall,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  FileText,
  Building2,
} from 'lucide-react';
import { BIS_DEPARTMENTS, BIS_PORTALS } from '../services/bisSaarthi';

interface LandingPageProps {
  onStartCall: (preset?: string) => void;
  isLoading?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCall,
  isLoading = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-100/60 via-sky-50/40 to-transparent blur-[100px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              BIS Saarthi
            </span>
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase block -mt-1">
              BUILT BY TEAM AKRIX
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            National Standards AI Voice Active
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16 z-10 flex-1 flex flex-col items-center">
        {/* Badge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-800 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-xs text-center"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          <span>Bureau of Indian Standards Conversational AI</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-center tracking-tight leading-[1.1] max-w-4xl text-slate-900"
        >
          BIS Saarthi
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-2xl text-slate-600 font-medium text-center mt-2 sm:mt-3 max-w-2xl leading-snug"
        >
          Your AI guide for Indian Standards (IS), ISI mark certification, gold hallmarking with 6-digit HUID, and mandatory Quality Control Orders.
        </motion.p>

        {/* CTA Voice Call Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-col items-center"
        >
          <button
            onClick={() => onStartCall()}
            disabled={isLoading}
            className="group relative px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg shadow-xl shadow-blue-200 hover:shadow-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            <span>Consult BIS Saarthi via Voice</span>
          </button>
          <span className="text-xs text-slate-400 font-medium mt-2">
            Speak naturally in English, Hindi or Hinglish
          </span>
        </motion.div>

        {/* 17 Technical Departments Showcase */}
        <div className="w-full mt-14 sm:mt-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                BIS Technical Division Councils
              </h2>
              <p className="text-xs text-slate-500">
                17 specialized technical departments regulating quality standards across India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BIS_DEPARTMENTS.slice(0, 6).map((dept) => (
              <div
                key={dept.code}
                onClick={() => onStartCall(dept.code)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-slate-400">Department</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Example: <span className="font-semibold text-slate-700">{dept.example}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Official BIS Portals Links */}
        <div className="w-full mt-10 p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Authoritative BIS Digital Portals</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BIS_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-xs text-slate-800 font-semibold flex items-center justify-between transition-colors"
              >
                <span className="truncate">{portal.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© 2026 BIS Saarthi — Built by Team AKRIX</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Dedicated to Indian Standards (IS), ISI Certification & National Quality
        </p>
      </footer>
    </div>
  );
};
