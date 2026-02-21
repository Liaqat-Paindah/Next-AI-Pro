import React from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Clock, Share2, ExternalLink, Star } from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { ScholarshipBadge } from "./ScholarshipBadge";
import { ValueIndicator } from "@/components/scholarships/ValueIndicator";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  daysRemaining: number;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved,
  onToggleSave,
  daysRemaining,
}) => {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      className="group relative border border-slate-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          scholarship.type === "fully funded"
            ? "bg-linear-to-r from-emerald-600 to-emerald-500"
            : "bg-linear-to-r from-amber-600 to-amber-500"
        }`}
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <ScholarshipBadge type={scholarship.type} />
          <button
            onClick={() => onToggleSave(scholarship._id)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                isSaved
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-2">
          {scholarship.title}
        </h3>

        {/* University */}
        {scholarship.universities && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {scholarship.universities}
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {scholarship.description}
        </p>

        {/* Level */}
        {scholarship.level && (
          <div className="mb-2">
            <ValueIndicator value={scholarship.level} />
          </div>
        )}

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded text-slate-600 dark:text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{scholarship.country}</span>
          </div>
          <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded text-slate-600 dark:text-slate-400">
            <CalendarDays className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="truncate">
              {new Date(scholarship.deadline).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded col-span-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span>
              {daysRemaining} days left
            </span>
          </div>
        </div>

        {/* fieldOfStudys of Study */}
        {scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {scholarship.fieldOfStudy.slice(0, 2).map((fieldOfStudy, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 rounded text-xs text-slate-600 dark:text-slate-400"
              >
                {fieldOfStudy}
              </span>
            ))}
            {scholarship.fieldOfStudy.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-slate-400">
                +{scholarship.fieldOfStudy.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-gray-700">
          <button className="flex-1 flex items-center justify-center gap-1 text-white text-xs font-medium py-2 px-2.5 rounded bg-linear-to-r from-[#005B96] to-[#005B96] hover:from-[#03396C] hover:to-[#005B96] transition-all">
            Apply & Details
            <ExternalLink className="w-3 h-3" />
          </button>
          <button className="p-2 border border-slate-200 dark:border-gray-700 rounded hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};