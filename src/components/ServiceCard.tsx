import React from 'react';
import { motion } from 'framer-motion';
import { BISDepartmentInfo } from '../types';
import {
  ShieldCheck,
  Award,
  BookOpen,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface BISDepartmentCardProps {
  department: BISDepartmentInfo;
  onSelectDepartment: (code: string) => void;
}

export const BISDepartmentCard: React.FC<BISDepartmentCardProps> = ({
  department,
  onSelectDepartment,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelectDepartment(department.code)}
      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
            {department.code}
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-600 uppercase">
            Division Council
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {department.name}
        </h3>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {department.description}
        </p>

        <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
          <FileText className="w-3 h-3" />
          <span>e.g., {department.exampleStandard}</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
        <span>Inquire Standards</span>
        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

// Aliased export
export const ServiceCard = BISDepartmentCard;
