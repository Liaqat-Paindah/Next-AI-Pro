"use client";

import { useEffect, useState } from "react";
import { UseAcademicArticles } from "@/hooks/useApplication";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

interface Article {
  title: string;
  apaReference: string;
  link: string;
}

// Icons for the form
const Icons = {
  Article: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16v16H4z" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  ),
  Reference: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Link: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Add: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Remove: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

// Form Input Component
const FormInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  
  multiline = false,
  rows = 3,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        <span className="text-[#00A3FF] ml-1">*</span>
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}

        {multiline ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light`}
          />
        )}

        {/* Digital Underline Effect */}
        <motion.div
          className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default function AcademicArticles() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const [hasArticles, setHasArticles] = useState<"Yes" | "No">("No");
  const [articles, setArticles] = useState<Article[]>([
    { title: "", apaReference: "", link: "" },
  ]);
  const { mutate, isPending } = UseAcademicArticles();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (isPending || status === "loading") {
    return <Loading></Loading>;
  }
  const handleChange = (index: number, field: keyof Article, value: string) => {
    const updated = [...articles];
    updated[index][field] = value;
    setArticles(updated);
  };

  const addArticle = () => {
    setArticles([...articles, { title: "", apaReference: "", link: "" }]);
  };

  const removeArticle = (index: number) => {
    setArticles(articles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    mutate({
      hasAcademicArticles: hasArticles,
      academicArticles: hasArticles === "Yes" ? articles : [],
      userId: userSession?.user._id as string,
    });
  };

  return (
    <>
      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          {/* linear Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 dark:bg-[#00A3FF]/5 rounded-full "
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative container">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8 relative">
              <div className="space-y-8">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-[#064e78] pb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                    Scientific Articles Publication
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Share your academic publications and research work
                  </p>
                </div>

                {/* First Question - Digital Radio */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Do you have any academic articles?
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>

                  <div className="flex gap-8">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            value={option}
                            required
                            checked={hasArticles === option}
                            onChange={() =>
                              setHasArticles(option as "Yes" | "No")
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-sm transition-all duration-300 ${
                              hasArticles === option
                                ? "border-[#00A3FF] bg-[#00A3FF]"
                                : "border-gray-300 dark:border-[#064e78] group-hover:border-[#00A3FF]"
                            }`}
                          >
                            {hasArticles === option && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-full h-full text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Articles Section */}
                {hasArticles === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {articles.map((article, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative border border-gray-200 dark:border-[#064e78] rounded-sm p-6 space-y-4"
                      >
                        {/* Article Number */}
                        <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#011b2b] text-xs font-medium text-[#00A3FF]">
                          Article {index + 1}
                        </div>

                        {/* Remove Button */}
                        {articles.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeArticle(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute -top-3 right-4 px-2 py-0.5 bg-white dark:bg-[#011b2b] text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 border border-gray-200 dark:border-[#064e78] rounded-sm"
                          >
                            <Icons.Remove className="w-3 h-3" />
                            Remove
                          </motion.button>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                          <FormInput
                            label="Article Title"
                            type="text"
                            value={article.title}
                            onChange={(e) =>
                              handleChange(index, "title", e.target.value)
                            }
                            placeholder="Enter article title"
                            icon={<Icons.Article className="w-4 h-4" />}
                          />

                          <FormInput
                            label="APA Reference"
                            type="text"
                            value={article.apaReference}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "apaReference",
                                e.target.value,
                              )
                            }
                            placeholder="Example: Paindah, L. (2025)..."
                            icon={<Icons.Reference className="w-4 h-4" />}
                            multiline
                            rows={3}
                          />

                          <FormInput
                            label="Article Link"
                            type="url"
                            value={article.link}
                            onChange={(e) =>
                              handleChange(index, "link", e.target.value)
                            }
                            placeholder="https://example.com"
                            icon={<Icons.Link className="w-4 h-4" />}
                          />
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Article Button */}
                    <motion.button
                      type="button"
                      onClick={addArticle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full relative group"
                    >
                      <div className="absolute -inset-0.5  rounded-sm opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                      <div className="relative px-4 py-3 bg-white dark:bg-[#011b2b] border border-[#00A3FF] rounded-sm text-[#00A3FF]  text-sm flex items-center justify-center gap-2">
                        <Icons.Add className="w-4 h-4" />
                        Add Another Article
                      </div>
                    </motion.button>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                  <motion.button
                    type="button"
                    onClick={() => window.history.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
                  >
                    <div className="relative px-4 py-2 bg-transparent border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 hover:border-[#00A3FF] transition-colors">
                      <span>Back</span>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!hasArticles || isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 relative group ${
                      !hasArticles ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="absolute -inset-0.5  rounded-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-sm flex items-center justify-center gap-2">
                      {isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4  border-white border-t-transparent rounded-sm"
                          />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Save & Continue</span>
                          <Icons.ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
