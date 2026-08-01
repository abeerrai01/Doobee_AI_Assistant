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
    <div className="w-full flex-1 min-h-[220px] max-h-[340px] rounded-2xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-xl p-4 flex flex-col shadow-2xl shadow-amber-950/40 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Live Conversation Transcript
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </span>
      </div>

      {/* Transcript Messages List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-3 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-amber-200/50">
            <Bot className="w-8 h-8 mb-2 opacity-60 text-amber-400 animate-pulse" />
            <p className="text-xs font-bold text-amber-300">
              Session initialized. AI is greeting...
            </p>
            <p className="text-[11px] text-amber-200/60 mt-1">
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
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4 text-amber-400" />
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md backdrop-blur-md ${
                      isAi
                        ? 'bg-amber-950/80 border border-amber-500/40 text-amber-100 rounded-tl-sm'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-tr-sm border border-amber-300 shadow-amber-950/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span
                        className={`text-[10px] font-extrabold tracking-wide uppercase ${
                          isAi ? 'text-amber-400' : 'text-black'
                        }`}
                      >
                        {isAi ? 'Doobee AI' : 'You'}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isAi ? 'text-amber-300/70' : 'text-black/80'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="break-words font-medium">{msg.text}</p>
                  </div>

                  {/* User Icon */}
                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-amber-900/60 border border-amber-500/50 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4 text-amber-300" />
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
