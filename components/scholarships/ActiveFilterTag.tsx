import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ActiveFilterTagProps {
  label: string;
  onRemove: () => void;
}

export const ActiveFilterTag: React.FC<ActiveFilterTagProps> = ({ label, onRemove }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#005B96]/10 text-[#005B96] dark:text-[#9bcaf6] rounded-full text-xs font-medium"
  >
    {label}
    <button
      onClick={onRemove}
      className="hover:bg-[#005B96]/20 rounded-full p-0.5"
    >
      <X className="w-3 h-3" />
    </button>
  </motion.span>
);