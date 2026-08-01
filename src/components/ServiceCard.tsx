import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCategory } from '../types';
import {
  Wrench,
  Zap,
  Hammer,
  HardHat,
  Paintbrush,
  Sparkles,
  Snowflake,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceCategory;
  onSelectService: (serviceName: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-blue-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-orange-400" />;
      case 'HardHat':
        return <HardHat className="w-6 h-6 text-emerald-400" />;
      case 'Paintbrush':
        return <Paintbrush className="w-6 h-6 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-teal-400" />;
      case 'Snowflake':
        return <Snowflake className="w-6 h-6 text-sky-400" />;
      default:
        return <Wrench className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelectService(service.name)}
      className="group cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-md flex flex-col justify-between hover:bg-slate-800/80 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Accent Blur */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-600/10 blur-xl group-hover:bg-blue-500/20 transition-all" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:border-blue-400/50 group-hover:scale-110 transition-all duration-300">
            {getIcon(service.iconName)}
          </div>

          {service.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 border border-blue-800/60 text-blue-300 uppercase tracking-wider">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
          {service.name}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Popular Service Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {service.popularServices.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800/60 text-slate-400 group-hover:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
        <span className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5" />
          Call AI for {service.name}
        </span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};
