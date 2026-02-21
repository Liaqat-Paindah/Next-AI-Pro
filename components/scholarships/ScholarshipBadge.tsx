import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";

interface ScholarshipBadgeProps {
  type: string;
  featured?: boolean;
}

export const ScholarshipBadge: React.FC<ScholarshipBadgeProps> = ({ type, featured }) => {
  const isFull = type === "fully funded";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 flex-wrap"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded
          ${
            isFull
              ? "bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "bg-linear-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
          }
        `}
      >
        {isFull ? <Trophy className="w-3 h-3" /> : <Star className="w-3 h-3" />}
        {isFull ? "Fully Funded" : "Partial"}
      </motion.div>
      {featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded text-[#03396C] dark:text-[#03396C] border border-[#03396C] dark:border-[#03396C]"
        >
          <Sparkles className="w-3 h-3" />
          FEATURED
        </motion.div>
      )}
    </motion.div>
  );
};