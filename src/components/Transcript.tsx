import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranscriptMessage } from '../types';
import { ShieldCheck, User, MessageSquare } from 'lucide-react';

interface TranscriptProps {
  messages: TranscriptMessage[];
}

export const Transcript: React.FC<TranscriptProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="w-full flex-1 min-h-[200px] max-h-[320px] rounded-2xl bg-white border border-slate-200 shadow-md p-3.5 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Standards Inquiry Transcript
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </span>
      </div>

      {/* Transcript Messages List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-2.5 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <ShieldCheck className="w-8 h-8 mb-2 opacity-60 text-blue-600 animate-pulse" />
            <p className="text-xs font-bold text-slate-700">
              Session initialized. AI is greeting...
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Live conversation transcript will appear here in real time.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* AI Avatar Icon */}
                  {isAi && (
                    <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAi
                        ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                        : 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <span
                        className={`text-[10px] font-bold tracking-wide uppercase ${
                          isAi ? 'text-blue-700' : 'text-blue-100'
                        }`}
                      >
                        {isAi ? 'BIS Saarthi' : 'You'}
                      </span>
                      <span
                        className={`text-[9px] ${
                          isAi ? 'text-slate-400' : 'text-blue-200'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="whitespace-pre-line break-words text-xs">
                      {msg.text}
                    </p>
                  </div>

                  {/* User Avatar Icon */}
                  {!isAi && (
                    <div className="w-6 h-6 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <User className="w-3.5 h-3.5 text-slate-700" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
