"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

// Document type definition
type DocumentType = 
  | "sop"
  | "recommendationLetters"
  | "cv"
  | "researchProposal"
  | "portfolio"
  | "nid"
  | "passport";

interface DocumentFile {
  id: string;
  type: DocumentType;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

interface DocumentConfig {
  label: string;
  accept: string;
  multiple?: boolean;
  maxSize: number; // in bytes
  required: boolean;
  description?: string;
}

// Document configurations
const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
  sop: {
    label: "Statement of Purpose (SOP)",
    accept: ".pdf,.doc,.docx",
    maxSize: 10 * 1024 * 1024, // 10MB
    required: true,
    description: "Explain your academic interests, goals, and reasons for applying",
  },
  recommendationLetters: {
    label: "Letters of Recommendation",
    accept: ".pdf,.doc,.docx",
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB each
    required: true,
    description: "Minimum 2 letters from academic or professional references",
  },
  cv: {
    label: "Curriculum Vitae (CV)",
    accept: ".pdf,.doc,.docx",
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
    description: "Detailed overview of your education, experience, and skills",
  },
  researchProposal: {
    label: "Research Proposal",
    accept: ".pdf,.doc,.docx",
    maxSize: 10 * 1024 * 1024, // 10MB
    required: false,
    description: "For research-based programs only",
  },
  portfolio: {
    label: "Portfolio (For Art & Design Programs)",
    accept: ".pdf,.zip",
    maxSize: 50 * 1024 * 1024, // 50MB
    required: false,
    description: "Showcase your creative work",
  },
  nid: {
    label: "National ID (NID / Tazkira)",
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
    description: "Clear scanned copy or photo",
  },
  passport: {
    label: "Passport Copy",
    accept: ".pdf,.jpg,.jpeg,.png",
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
    description: "Valid passport information page",
  },
};


// Icons component
const Icons = {
  Upload: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Error: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Trash: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Loading: ({ className = "w-5 h-5" }) => (
    <svg className={className + " animate-spin"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="32" strokeDashoffset="32" />
    </svg>
  ),
};

export default function DocumentsUpload() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadQueue, setUploadQueue] = useState<DocumentType[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Simulate file upload with progress
  const uploadFile = useCallback(async (document: DocumentFile) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Update document status to success
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === document.id
                ? { ...doc, progress: 100, status: "success", url: URL.createObjectURL(doc.file) }
                : doc
            )
          );
          
          // Remove from queue
          setUploadQueue(prev => prev.filter(t => t !== document.type));
          resolve();
        } else {
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === document.id ? { ...doc, progress } : doc
            )
          );
        }
      }, 200);
    });
  }, []);

  // Process upload queue
  React.useEffect(() => {
    const processQueue = async () => {
      if (uploadQueue.length === 0 || isUploading) return;

      setIsUploading(true);
      const documentsToUpload = documents.filter(doc => 
        uploadQueue.includes(doc.type) && doc.status === "pending"
      );

      for (const doc of documentsToUpload) {
        try {
          await uploadFile(doc);
        } catch  {
          setDocuments(prev =>
            prev.map(d =>
              d.id === doc.id
                ? { ...d, status: "error", error: "Upload failed" }
                : d
            )
          );
        }
      }

      setIsUploading(false);
    };

    processQueue();
  }, [uploadQueue, documents, isUploading, uploadFile]);

  const validateFile = (file: File, config: DocumentConfig): string | null => {
    if (file.size > config.maxSize) {
      return `File size must be less than ${config.maxSize / (1024 * 1024)}MB`;
    }

    const acceptedTypes = config.accept.split(",").map(type => type.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    
    if (!acceptedTypes.includes(fileExtension) && 
        !acceptedTypes.some(type => file.type.includes(type.replace(".", "")))) {
      return `Invalid file type. Accepted: ${config.accept}`;
    }

    return null;
  };

  const handleFileSelect = (type: DocumentType, files: FileList | null) => {
    if (!files) return;

    const config = DOCUMENT_CONFIGS[type];
    const filesArray = Array.from(files);

    // Validate each file
    for (const file of filesArray) {
      const error = validateFile(file, config);
      if (error) {
        alert(error);
        return;
      }
    }

    // Create document entries
    const newDocuments: DocumentFile[] = filesArray.map(file => ({
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      file,
      progress: 0,
      status: "pending",
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Add to upload queue
    if (!uploadQueue.includes(type)) {
      setUploadQueue(prev => [...prev, type]);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => {
      const removed = prev.find(doc => doc.id === id);
      if (removed?.status === "pending" || removed?.status === "uploading") {
        setUploadQueue(prev => prev.filter(t => t !== removed.type));
      }
      return prev.filter(doc => doc.id !== id);
    });
  };

  const getDocumentsByType = (type: DocumentType) => {
    return documents.filter(doc => doc.type === type);
  };

  const getOverallProgress = () => {
    if (documents.length === 0) return 0;
    const totalProgress = documents.reduce((sum, doc) => sum + doc.progress, 0);
    return Math.round(totalProgress / documents.length);
  };

  const allRequiredUploaded = () => {
    const requiredTypes = (Object.entries(DOCUMENT_CONFIGS) as [DocumentType, DocumentConfig][])
      .filter(([, config]) => config.required)
      .map(([type]) => type);

    return requiredTypes.every(type => 
      documents.some(doc => doc.type === type && doc.status === "success")
    );
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#011b2b] rounded-xl shadow-md border border-gray-200 dark:border-[#064e78] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#064e78]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Required Documents
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Upload your documents one by one. They will be uploaded automatically.
              </p>
            </div>
            
            {/* Overall Progress */}
            {documents.length > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Progress
                </div>
                <div className="text-2xl font-bold text-[#00A3FF]">
                  {getOverallProgress()}%
                </div>
              </div>
            )}
          </div>

          {/* Overall Progress Bar */}
          {documents.length > 0 && (
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                initial={{ width: 0 }}
                animate={{ width: `${getOverallProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="p-6 space-y-8">
          {(Object.entries(DOCUMENT_CONFIGS) as [DocumentType, DocumentConfig][]).map(([type, config]) => {
            const typeDocuments = getDocumentsByType(type);
            const isUploading = typeDocuments.some(doc => doc.status === "uploading");

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-300">
                      {config.label}
                      {config.required && (
                        <span className="text-[#00A3FF] ml-1">*</span>
                      )}
                    </label>
                    {config.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {config.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="ml-4">
                    <input
                      type="file"
                      id={`file-${type}`}
                      accept={config.accept}
                      multiple={config.multiple}
                      className="hidden"
                      onChange={(e) => handleFileSelect(type, e.target.files)}
                    />
                    <motion.button
                      type="button"
                      onClick={() => document.getElementById(`file-${type}`)?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isUploading}
                      className="px-4 py-2 bg-[#00A3FF]/10 text-[#00A3FF] rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#00A3FF]/20 transition-colors disabled:opacity-50"
                    >
                      <Icons.Upload className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </motion.button>
                  </div>
                </div>

                {/* Uploaded Files */}
                <AnimatePresence>
                  {typeDocuments.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 space-y-2"
                    >
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#011b2b]/50 rounded-lg border border-gray-200 dark:border-[#064e78]">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Status Icon */}
                          <div className="">
                            {doc.status === "success" && (
                              <Icons.Check className="w-5 h-5 text-green-500" />
                            )}
                            {doc.status === "error" && (
                              <Icons.Error className="w-5 h-5 text-red-500" />
                            )}
                            {doc.status === "uploading" && (
                              <Icons.Loading className="w-5 h-5 text-[#00A3FF]" />
                            )}
                            {doc.status === "pending" && (
                              <Icons.Upload className="w-5 h-5 text-gray-400" />
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {doc.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(doc.file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>

                          {/* Progress Bar */}
                          {doc.status === "uploading" && (
                            <div className="w-24">
                              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${doc.progress}%` }}
                                  transition={{ duration: 0.2 }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {Math.round(doc.progress)}%
                              </p>
                            </div>
                          )}

                          {/* Success/Error Message */}
                          {doc.status === "success" && doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00A3FF] hover:underline"
                            >
                              View
                            </a>
                          )}
                          {doc.status === "error" && (
                            <p className="text-xs text-red-500">{doc.error}</p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Multiple files indicator */}
                {config.multiple && typeDocuments.length > 0 && (
                  <p className="text-xs text-gray-500 ml-4">
                    {typeDocuments.length} file(s) uploaded
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-[#064e78] bg-gray-50 dark:bg-[#011b2b]/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {documents.length} file(s) selected • {getOverallProgress()}% complete
            </div>
            
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-[#00A3FF] transition-colors"
              >
                Back
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => router.push("/application/review")}
                disabled={!allRequiredUploaded() || isUploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-lg text-sm font-medium flex items-center gap-2 ${
                  !allRequiredUploaded() || isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isUploading ? (
                  <>
                    <Icons.Loading className="w-4 h-4" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Validation Summary */}
          {!allRequiredUploaded() && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-red-500"
            >
              Please upload all required documents before continuing.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}