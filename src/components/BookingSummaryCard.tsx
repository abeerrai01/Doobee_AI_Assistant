import React from 'react';
import { motion } from 'framer-motion';
import { ExtractedBookingDetails } from '../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  UserCheck,
  PhoneCall,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Tag,
  Wrench,
  Award,
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
====================================================
           DOOBEE AI GOLDEN SERVICE RECEIPT
====================================================
Booking ID:        ${summary.bookingId}
Booking Date:      ${summary.bookingDate}
Time Slot:         ${summary.bookingTimeSlot}
Status:            CONFIRMED & EXPERT DISPATCHED

CUSTOMER DETAILS:
Name:     ${summary.customerName}
Phone:    ${summary.customerPhone}
Address:  ${summary.customerLocation}

SERVICE DETAILS:
Service:  ${summary.serviceType}
Problem:  ${summary.problemSummary}
Est. Fee: ${summary.estimatedFee}

ASSIGNED TECHNICIAN:
Name:     ${summary.workerName} (Rating: ${summary.workerRating} ★)
Phone:    ${summary.workerPhone}
Status:   BACKGROUND VERIFIED & EN ROUTE
====================================================
Thank you for using Doobee AI Voice Assistant!
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Doobee_Golden_Receipt_${summary.bookingId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto my-auto p-4 sm:p-5 bg-[#0f0b01]/95 border-2 border-amber-500/60 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.35)] backdrop-blur-2xl text-slate-100 flex flex-col justify-between z-20 relative overflow-hidden select-none"
    >
      {/* Background Gold Ambient Glow Accents */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Golden Header Banner */}
        <div className="flex flex-col items-center text-center pb-3 border-b border-amber-500/30">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-300/40 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/80 mb-2"
          >
            <CheckCircle2 className="w-8 h-8 text-amber-400" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/50 text-[11px] font-bold text-amber-300 mb-1 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>GOLDEN BOOKING CONFIRMED</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mt-0.5">
            {summary.serviceType} Service
          </h2>

          <p className="text-[11px] text-amber-200/80 font-mono mt-0.5">
            Ref ID: <span className="text-amber-400 font-extrabold">{summary.bookingId}</span>
          </p>
        </div>

        {/* Details Grid Section */}
        <div className="py-3 space-y-2.5">
          {/* Customer Details Box */}
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1.5 border-b border-amber-500/20 pb-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" /> Customer Details
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 border border-amber-500/40 font-mono">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-amber-200/60 block uppercase font-bold">Name</span>
                <span className="font-semibold text-white">{summary.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-200/60 block uppercase font-bold">Phone</span>
                <span className="font-semibold text-amber-200">{summary.customerPhone}</span>
              </div>
            </div>

            <div className="mt-1.5 pt-1.5 border-t border-amber-500/20 flex items-start gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-slate-200 text-[11px] font-medium">{summary.customerLocation}</span>
            </div>
          </div>

          {/* Date & Time Slot Card */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300/70 block">Booking Date</span>
                <span className="text-xs font-semibold text-white">{summary.bookingDate}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300/70 block">Time Slot</span>
                <span className="text-xs font-semibold text-amber-300">{summary.bookingTimeSlot}</span>
              </div>
            </div>
          </div>

          {/* Accurately Extracted Problem Box */}
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Extracted Problem Details</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal bg-black/40 p-2 rounded-xl border border-amber-500/20">
              "{summary.problemSummary}"
            </p>
          </div>

          {/* Assigned Technician & Fee Box */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 border border-amber-400/50 flex items-center justify-between shadow-lg shadow-amber-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center font-bold shrink-0 shadow-md">
                <UserCheck className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{summary.workerName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-extrabold shadow-sm">
                    ★ {summary.workerRating}
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 flex items-center gap-1 mt-0.5 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Expert Assigned ({summary.estimatedFee})
                </span>
              </div>
            </div>

            <a
              href={`tel:${summary.workerPhone}`}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold shadow-md active:scale-95 transition-transform"
              title="Call Technician"
            >
              <PhoneCall className="w-4 h-4 text-black" />
            </a>
          </div>
        </div>
      </div>

      {/* Golden Actions Footer */}
      <div className="pt-2.5 border-t border-amber-500/30 flex items-center justify-between gap-3">
        <button
          onClick={handleDownloadReceipt}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Receipt</span>
        </button>

        <button
          onClick={onNewCall}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/80 cursor-pointer active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-black" />
          <span>New Call</span>
        </button>
      </div>
    </motion.div>
  );
};
