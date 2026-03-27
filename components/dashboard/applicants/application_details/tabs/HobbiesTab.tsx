import { Application } from "@/types/application_details";
import { Heart, Dumbbell, Music, Gamepad2, Palette, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface HobbiesTabProps {
  hobbies?: Application["hobbies"];
}

const HobbiesTab = ({ hobbies }: HobbiesTabProps) => {
  const sports = hobbies?.sports?.trim();
  const freeTimeActivities = hobbies?.freeTimeActivities?.trim();
  const hasData = Boolean(sports || freeTimeActivities);

  if (!hasData) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Heart className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Hobbies Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added any hobbies or activities details yet.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to categorize free time activities
  const categorizeActivities = (activities: string) => {
    const activityCategories = [
      { icon: Music, name: "Music & Arts", keywords: ["music", "sing", "dance", "art", "draw", "paint", "theater", "drama"] },
      { icon: Gamepad2, name: "Gaming & Tech", keywords: ["game", "gaming", "coding", "programming", "tech", "computer"] },
      { icon: Palette, name: "Creative", keywords: ["craft", "design", "photo", "writing", "blog", "cook", "bake"] },
      { icon: BookOpen, name: "Reading & Learning", keywords: ["read", "book", "learn", "study", "research"] },
      { icon: Dumbbell, name: "Fitness & Wellness", keywords: ["yoga", "gym", "fitness", "run", "walk", "meditate"] },
    ];

    const lowerActivities = activities.toLowerCase();
    const matchedCategories = activityCategories.filter(category =>
      category.keywords.some(keyword => lowerActivities.includes(keyword))
    );

    return matchedCategories.length > 0 ? matchedCategories : null;
  };

  const categories = freeTimeActivities ? categorizeActivities(freeTimeActivities) : null;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hobbies & Interests
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sports and free-time activities
            </p>
          </div>
        </div>
      </div>

      {/* Hobbies Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Two Row Layout */}
          <div className="space-y-6">
            {/* Row 1 - Sports */}
            {sports && (
              <HobbySection
                icon={<Dumbbell className="h-4 w-4 text-[#00A3FF]" />}
                title="Sports & Athletics"
                content={sports}
                placeholder="No sports activities specified"
              />
            )}

            {/* Row 2 - Free Time Activities */}
            {freeTimeActivities && (
              <div className="space-y-4">
                <HobbySection
                  icon={<Heart className="h-4 w-4 text-[#00A3FF]" />}
                  title="Free Time Activities"
                  content={freeTimeActivities}
                  placeholder="No free time activities specified"
                />

                {/* Activity Categories */}
                {categories && categories.length > 0 && (
                  <div className="mt-2 ml-11">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider mb-3">
                      Activity Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 rounded-sm bg-[#00A3FF]/10 px-2.5 py-1.5 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20"
                          >
                            <Icon className="h-3 w-3" />
                            {category.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

// Hobby Section Component
const HobbySection = ({
  icon,
  title,
  content,
  placeholder,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  placeholder?: string;
}) => {
  return (
    <div className="flex items-start gap-3 pb-6 border-b border-gray-200 dark:border-white/10 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          {title}
        </p>
        <div className="mt-2">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {content || placeholder}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HobbiesTab;