import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranscriptMessage } from '../types';
import { Bot, User, MessageSquare } from 'lucide-react';

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
    <div className="w-full flex-1 min-h-[220px] max-h-[340px] rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl p-4 flex flex-col shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Conversation Transcript
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </span>
      </div>

      {/* Transcript Messages List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-3 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Bot className="w-8 h-8 mb-2 opacity-40 text-blue-400 animate-pulse" />
            <p className="text-xs font-medium text-slate-400">
              Session initialized. AI is greeting...
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Live speech transcript will appear here in real time.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-2.5 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* AI Avatar Icon */}
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md backdrop-blur-md ${
                      isAi
                        ? 'bg-slate-900/90 border border-slate-700/80 text-slate-100 rounded-tl-sm'
                        : 'bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-tr-sm border border-blue-400/30 shadow-blue-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span
                        className={`text-[10px] font-bold tracking-wide uppercase ${
                          isAi ? 'text-blue-400' : 'text-blue-100'
                        }`}
                      >
                        {isAi ? 'Doobee AI' : 'You'}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isAi ? 'text-slate-400' : 'text-blue-200'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="break-words font-normal">{msg.text}</p>
                  </div>

                  {/* User Icon */}
                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4 text-slate-300" />
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
