"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useState, useEffect } from "react";
import { useUploadDocument } from "@/hooks/useApplication";
import { DocumentType } from "@/types/document";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

// Icons for the document uploader
const Icons = {
  Upload: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  File: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Alert: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  PDF: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h6" />
      <path d="M9 18h6" />
      <path d="M9 12h6" />
    </svg>
  ),
  Image: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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
  Save: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Menu: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

// Digital Cursor Component (reused from your design)
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#00A3FF] hidden lg:block mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

// Document Category Interface
interface DocumentCategory {
  id: DocumentType;
  label: string;
  description: string;
  icon: React.ReactNode;
  acceptedFormats: string[];
  maxSize: string;
  maxSizeBytes: number;
  isRequired: boolean;
}

// Uploaded File Interface
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const { mutate, isPending: isGlobalPending } = useUploadDocument();

  const [uploadedFiles, setUploadedFiles] = useState<
    Record<DocumentType, UploadedFile | null>
  >({
    sop: null,
    recommendationLetters: null,
    cv: null,
    researchProposal: null,
    portfolio: null,
    nid: null,
    passport: null,
  });

  const [uploadProgress, setUploadProgress] = useState<
    Record<DocumentType, number>
  >({} as Record<DocumentType, number>);
  const [dragActive, setDragActive] = useState<DocumentType | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState<DocumentType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Document categories configuration
  const documentCategories: DocumentCategory[] = [
    {
      id: "cv",
      label: "Curriculum Vitae *",
      description: "Your updated CV/Resume",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".doc", ".docx"],
      maxSize: "5MB",
      maxSizeBytes: 5 * 1024 * 1024,
      isRequired: true,
    },
    {
      id: "sop",
      label: "Statement of Purpose *",
      description: "Your academic and career goals",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".doc", ".docx"],
      maxSize: "5MB",
      maxSizeBytes: 5 * 1024 * 1024,
      isRequired: true,
    },
    {
      id: "recommendationLetters",
      label: "Recommendation Letters *",
      description: "Academic/professional recommendations",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf"],
      maxSize: "10MB",
      maxSizeBytes: 10 * 1024 * 1024,
      isRequired: true,
    },
    {
      id: "researchProposal",
      label: "Research Proposal",
      description: "Detailed research plan (if applicable)",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".doc", ".docx"],
      maxSize: "5MB",
      maxSizeBytes: 5 * 1024 * 1024,
      isRequired: false,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      description: "Work samples or portfolio",
      icon: <Icons.Image className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".jpg", ".png", ".zip"],
      maxSize: "20MB",
      maxSizeBytes: 20 * 1024 * 1024,
      isRequired: false,
    },
    {
      id: "nid",
      label: "National ID *",
      description: "Government-issued ID",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".jpg", ".png"],
      maxSize: "3MB",
      maxSizeBytes: 3 * 1024 * 1024,
      isRequired: true,
    },
    {
      id: "passport",
      label: "Passport *",
      description: "Valid passport copy",
      icon: <Icons.File className="w-5 h-5" />,
      acceptedFormats: [".pdf", ".jpg", ".png"],
      maxSize: "3MB",
      maxSizeBytes: 3 * 1024 * 1024,
      isRequired: true,
    },
  ];

  // Simulate upload progress
  const simulateProgress = (type: DocumentType, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Mark as completed
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: {
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 100,
            status: "completed",
          },
        }));

        // Show success message
        setShowSuccessMessage(type);
        setTimeout(() => setShowSuccessMessage(null), 3000);
      }

      setUploadProgress((prev) => ({
        ...prev,
        [type]: Math.min(progress, 100),
      }));
    }, 200);
  };

  const validateFile = (
    file: File,
    category: DocumentCategory,
  ): string | null => {
    // Check file size
    if (file.size > category.maxSizeBytes) {
      return `File size exceeds ${category.maxSize} limit`;
    }

    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!category.acceptedFormats.includes(fileExtension)) {
      return `Invalid file format. Accepted formats: ${category.acceptedFormats.join(", ")}`;
    }

    return null;
  };

  const handleUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: DocumentType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = userSession?.user?._id;
    if (!userId) {
      setErrorMessage("User not authenticated");
      return;
    }

    const category = documentCategories.find((cat) => cat.id === type);
    if (!category) return;

    // Validate file
    const validationError = validateFile(file, category);
    if (validationError) {
      setErrorMessage(validationError);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Set initial uploading state
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: {
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
      },
    }));

    // Start progress simulation
    simulateProgress(type, file);

    // Actual upload mutation
    mutate({
      userId,
      type,
      file,
    });
  };

  const handleDrag = (e: React.DragEvent, type: DocumentType | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (type) {
      setDragActive(type);
    } else {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: DocumentType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.getElementById(`file-${type}`) as HTMLInputElement;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        // Trigger change event
        const event = new Event("change", { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  };

  const removeFile = (type: DocumentType) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: null,
    }));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[type];
      return newProgress;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getRequiredDocuments = () => {
    return documentCategories.filter((doc) => doc.isRequired).length;
  };

  const getUploadedRequiredCount = () => {
    return documentCategories.filter(
      (doc) => doc.isRequired && uploadedFiles[doc.id]?.status === "completed",
    ).length;
  };


  const isContinueDisabled = () => {
    return (
      getUploadedRequiredCount() < getRequiredDocuments() || isGlobalPending
    );
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-4 sm:py-8">
     

        <div className="relative container mx-auto px-3 sm:px-4">
          {/* Mobile Header */}
          <div className="lg:hidden mb-4">
            <div className="bg-white/50 dark:bg-[#011b2b]/50 backdrop-blur-sm border border-gray-200 dark:border-[#064e78] rounded-sm p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Documents
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#064e78] rounded-sm transition-colors"
                >
                  <Icons.Menu className="w-5 h-5" />
                </button>
              </div>


            </div>
          </div>

          {/* Desktop Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8 hidden lg:block"
          >
            <div className="bg-white/50 dark:bg-[#011b2b]/50 backdrop-blur-sm border border-gray-200 dark:border-[#064e78] rounded-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Document Upload
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please upload all required documents for your application
                  </p>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto mb-4"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-3 flex items-center gap-2">
                  <Icons.Alert className="w-4 h-4 text-red-500 " />
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Documents Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {documentCategories.map((category, index) => {
                const currentFile = uploadedFiles[category.id];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div
                      className={`bg-white dark:bg-[#011b2b] border ${
                        dragActive === category.id
                          ? "border-[#00A3FF]"
                          : currentFile?.status === "completed"
                            ? "border-green-500"
                            : "border-gray-200 dark:border-[#064e78]"
                      } rounded-sm p-3 sm:p-5 transition-all duration-300 hover:shadow-lg`}
                      onDragEnter={(e) => handleDrag(e, category.id)}
                      onDragLeave={(e) => handleDrag(e, null)}
                      onDragOver={(e) => handleDrag(e, category.id)}
                      onDrop={(e) => handleDrop(e, category.id)}
                    >

                      {/* Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div
                            className={`p-1.5 sm:p-2 rounded-sm  ${
                              currentFile?.status === "completed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-[#00A3FF]/10 text-[#00A3FF]"
                            }`}
                          >
                            {category.icon}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                              {category.label}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Upload Area */}
                      {!currentFile ? (
                        <div
                          className={`border-2 border-dashed ${
                            dragActive === category.id
                              ? "border-[#00A3FF] bg-[#00A3FF]/5"
                              : "border-gray-300 dark:border-[#064e78]"
                          } rounded-sm p-3 sm:p-6 text-center transition-all duration-300`}
                        >
                          <input
                            type="file"
                            id={`file-${category.id}`}
                            className="hidden"
                            onChange={(e) => handleUpload(e, category.id)}
                            accept={category.acceptedFormats.join(",")}
                          />

                          <label
                            htmlFor={`file-${category.id}`}
                            className="cursor-pointer block"
                          >
                            <Icons.Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-400" />
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span className="text-[#00A3FF] font-medium">
                                Click to upload
                              </span>
                              <span className="hidden sm:inline">
                                {" "}
                                or drag and drop
                              </span>
                            </p>
                            <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-500">
                              {category.acceptedFormats.join(", ")} (Max:{" "}
                              {category.maxSize})
                            </p>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {/* File Info */}
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-[#021c29] rounded-sm">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {currentFile.type.includes("pdf") ? (
                                <Icons.PDF className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 " />
                              ) : (
                                <Icons.File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 " />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {currentFile.name}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(currentFile.size)}
                                </p>
                              </div>
                            </div>

                            {currentFile.status === "completed" ? (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center ">
                                  <Icons.Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                </div>
                                <button
                                  onClick={() => removeFile(category.id)}
                                  className="p-1 hover:bg-red-500/10 rounded-sm transition-colors "
                                  aria-label="Remove file"
                                >
                                  <Icons.Trash className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => removeFile(category.id)}
                                className="p-1 hover:bg-red-500/10 rounded-sm transition-colors "
                                aria-label="Remove file"
                              >
                                <Icons.Trash className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                              </button>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {currentFile.status === "uploading" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] sm:text-xs">
                                <span className="text-gray-500">
                                  Uploading...
                                </span>
                                <span className="text-[#00A3FF]">
                                  {Math.round(uploadProgress[category.id] || 0)}
                                  %
                                </span>
                              </div>
                              <div className="h-1 sm:h-1.5 bg-gray-200 dark:bg-[#064e78] rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${uploadProgress[category.id] || 0}%`,
                                  }}
                                  transition={{ duration: 0.1 }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Success Message */}
                          <AnimatePresence>
                            {showSuccessMessage === category.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1"
                              >
                                <Icons.Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span>Upload completed successfully!</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Format Hints - Mobile optimized */}
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                        {category.acceptedFormats.map((format) => (
                          <span
                            key={format}
                            className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-[#021c29] text-gray-600 dark:text-gray-400 rounded-sm"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-[#064e78]"
            >
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 relative group"
              >
                <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 dark:bg-[#076094] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border border-gray-300 dark:border-[#5fb7e9]">
                  <span>Back</span>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push("/dashboard/applicants")}
                disabled={isContinueDisabled()}
                whileHover={!isContinueDisabled() ? { scale: 1.02 } : {}}
                whileTap={!isContinueDisabled() ? { scale: 0.98 } : {}}
                className={`flex-1 relative group ${
                  isContinueDisabled() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="absolute -inset-0.5 rounded-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-xs sm:text-sm flex items-center justify-center gap-2">
                  {isGlobalPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Review</span>
                      <Icons.ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
