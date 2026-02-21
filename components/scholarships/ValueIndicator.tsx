import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface ValueIndicatorProps {
  value: string;
}

export const ValueIndicator: React.FC<ValueIndicatorProps> = ({ value }) => (
  <motion.div
    whileHover={{ scale: 1.01, x: 2 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-[#03396C] dark:text-[#9bcaf6] border border-[#03396C] dark:border-[#03396C]"
  >
    <Award className="w-3.5 h-3.5" />
    <span>{value}</span>
  </motion.div>
);