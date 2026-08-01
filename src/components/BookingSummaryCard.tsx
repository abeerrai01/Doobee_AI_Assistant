import React from 'react';
import { motion } from 'framer-motion';
import { ExtractedBookingDetails } from '../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  PhoneCall,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Tag,
  Wrench,
} from 'lucide-react';

interface BookingSummaryCardProps {
  summary: ExtractedBookingDetails;
  onNewCall: () => void;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  summary,
  onNewCall,
}) => {
  const handleDownloadReceipt = () => {
    const textContent = `
========================================
       DOOBEE AI SERVICE RECEIPT
========================================
Booking ID:      ${summary.bookingId}
Date & Time:     ${summary.createdAt}
Service Type:    ${summary.serviceType}
Problem:         ${summary.problemSummary}
Scheduled Time:  ${summary.scheduledTime}
Location:        ${summary.customerAddress}
Estimated Fee:   ${summary.estimatedFee}

ASSIGNED TECHNICIAN:
Name:   ${summary.workerName} (Rating: ${summary.workerRating} ★)
Phone:  ${summary.workerPhone}
Status: VERIFIED & DISPATCHED
========================================
Thank you for using Doobee AI Voice Assistant!
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Doobee_Receipt_${summary.bookingId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto my-auto p-4 sm:p-6 bg-[#0c051d]/95 border border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.3)] backdrop-blur-2xl text-slate-100 flex flex-col justify-between z-20 relative overflow-hidden select-none"
    >
      {/* Background Glow Accents */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Success Header Badge */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-purple-900/60">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/60 mb-3"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>AI Booking Confirmed</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            {summary.serviceType} Service Booked
          </h2>

          <p className="text-xs text-purple-200/80 font-mono mt-1">
            Booking Ref: <span className="text-purple-300 font-bold">{summary.bookingId}</span>
          </p>
        </div>

        {/* Extracted Details Grid */}
        <div className="py-4 space-y-3">
          {/* Issue Summary */}
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-1">
              <Wrench className="w-3.5 h-3.5 text-purple-400" />
              <span>Problem Extracted</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {summary.problemSummary}
            </p>
          </div>

          {/* Scheduled Time & Location */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Arrival</span>
                <span className="text-xs font-semibold text-slate-100">{summary.scheduledTime}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2">
              <Tag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Fee</span>
                <span className="text-xs font-semibold text-emerald-300">{summary.estimatedFee}</span>
              </div>
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{summary.workerName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/40">
                    ★ {summary.workerRating}
                  </span>
                </div>
                <span className="text-[10px] text-purple-300 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Expert Dispatched
                </span>
              </div>
            </div>

            <a
              href={`tel:${summary.workerPhone}`}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-transform"
              title="Call Technician"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-purple-900/60 flex items-center justify-between gap-3">
        <button
          onClick={handleDownloadReceipt}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-700/50 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Receipt</span>
        </button>

        <button
          onClick={onNewCall}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 cursor-pointer active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Call</span>
        </button>
      </div>
    </motion.div>
  );
};
