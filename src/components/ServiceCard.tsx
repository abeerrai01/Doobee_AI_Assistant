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
        return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-300" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-yellow-400" />;
      case 'HardHat':
        return <HardHat className="w-6 h-6 text-amber-400" />;
      case 'Paintbrush':
        return <Paintbrush className="w-6 h-6 text-yellow-300" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-300" />;
      case 'Snowflake':
        return <Snowflake className="w-6 h-6 text-amber-200" />;
      default:
        return <Wrench className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelectService(service.name)}
      className="group cursor-pointer rounded-2xl bg-amber-950/20 border border-amber-500/30 p-5 backdrop-blur-md flex flex-col justify-between hover:bg-amber-950/40 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-950/60 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Golden Accent Blur */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-400/20 transition-all" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-500/40 flex items-center justify-center shadow-inner group-hover:border-amber-400/80 group-hover:scale-110 transition-all duration-300">
            {getIcon(service.iconName)}
          </div>

          {service.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 border border-amber-400/50 text-amber-300 uppercase tracking-wider">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
          {service.name}
        </h3>

        <p className="text-xs text-amber-200/70 mt-1 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Popular Service Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {service.popularServices.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/30 text-amber-200/80 group-hover:text-amber-200 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
        <span className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5" />
          Call AI for {service.name}
        </span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-amber-400" />
      </div>
    </motion.div>
  );
};
