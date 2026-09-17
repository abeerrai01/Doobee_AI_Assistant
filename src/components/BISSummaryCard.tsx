import React from 'react';
import { motion } from 'framer-motion';
import { BISInquirySummary } from '../types';
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Download,
  RotateCcw,
  FileText,
  CheckCircle2,
  Building2,
  BookmarkCheck,
} from 'lucide-react';

interface BISSummaryCardProps {
  summary: BISInquirySummary;
  onNewCall: () => void;
}

export const BISSummaryCard: React.FC<BISSummaryCardProps> = ({
  summary,
  onNewCall,
}) => {
  const handleDownloadAdvisory = () => {
    const textContent = `
====================================================
      BIS SAARTHI — STANDARDS ADVISORY REPORT
====================================================
Inquiry ID:        ${summary.inquiryId}
Date:              ${summary.inquiryDate}
Built by:          Team AKRIX

SUBJECT / INQUIRY:
Topic:             ${summary.topic}
Standard:          ${summary.detectedStandard || 'General Inquiry'}
Title:             ${summary.standardTitle || 'N/A'}
Division Council:  ${summary.departmentCode || 'BIS'} - ${summary.departmentName || 'Technical Division'}

CERTIFICATION & REGULATORY SCOPE:
Scheme:            ${summary.scheme}
Regulatory Status: ${summary.mandatoryStatus}
Verification Mode: ${summary.verificationMethod}

KEY GUIDANCE & COMPLIANCE NOTES:
${summary.keyGuidance.map((g, i) => `${i + 1}. ${g}`).join('\n')}

OFFICIAL BIS DIGITAL PORTALS:
- BIS Official Portal:             https://www.bis.gov.in
- e-BIS Manakonline:               https://www.manakonline.in
- BIS Standards Portal:            https://standards.bis.gov.in
- National Single Window System:   https://www.nsws.gov.in

DISCLAIMER:
This summary is prepared by BIS Saarthi (Team AKRIX) for informational and guidance purposes. Always refer to official gazette notifications and manakonline.in for legally binding statutory compliance.
====================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BIS_Saarthi_Advisory_${summary.inquiryId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto my-auto p-4 sm:p-5 bg-white/95 border border-slate-200 rounded-3xl shadow-xl shadow-slate-300/40 backdrop-blur-xl text-slate-900 flex flex-col justify-between z-20 relative overflow-hidden select-none max-h-[85vh] overflow-y-auto"
    >
      {/* Background Soft Pearl Aura */}
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Banner */}
        <div className="flex flex-col items-center text-center pb-3 border-b border-slate-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
            className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm mb-2"
          >
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700 mb-1">
            <BookmarkCheck className="w-3 h-3 text-blue-600" />
            <span>STANDARDS ADVISORY SUMMARY</span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            {summary.topic}
          </h2>

          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Ref: {summary.inquiryId} • Team AKRIX
          </p>
        </div>

        {/* Standard & Scheme Details Card */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" /> Applicable Scheme:
            </span>
            <span className="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded-md text-[11px]">
              {summary.scheme}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Division Council:
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">
              {summary.departmentCode} ({summary.departmentName})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Regulatory Scope:
            </span>
            <span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-2 py-0.5 rounded-md">
              {summary.mandatoryStatus}
            </span>
          </div>
        </div>

        {/* Key Advisory Guidelines */}
        <div className="mt-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Key Compliance Guidance
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {summary.keyGuidance.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Official BIS Portals */}
        <div className="mt-3 pt-2 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Authoritative BIS Portals
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {summary.officialPortals.map((portal, idx) => (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-blue-700 font-medium flex items-center justify-between transition-colors shadow-xs"
              >
                <span className="truncate">{portal.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={handleDownloadAdvisory}
          className="flex-1 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Advisory</span>
        </button>

        <button
          onClick={onNewCall}
          className="h-10 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>New Query</span>
        </button>
      </div>
    </motion.div>
  );
};

// Aliased export for backwards compatibility
export const BookingSummaryCard = BISSummaryCard;
