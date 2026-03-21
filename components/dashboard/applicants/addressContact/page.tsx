"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { AddressContactData } from "@/types/contactAddress";
import { useAddressContact } from "@/hooks/useApplication";

// Icons
const Icons = {
  Location: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Phone: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a1.999 1.999 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 10a16 16 0 0 0 6 6l1.27-1.27a1.999 1.999 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  WhatsApp: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Home: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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
  Map: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
};

export default function AddressContactPage() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const { mutate, isPending } = useAddressContact();

  const [formData, setFormData] = useState<AddressContactData>({
    permanentProvince: "",
    permanentDistrict: "",
    permanentArea: "",
    currentProvince: "",
    currentDistrict: "",
    currentArea: "",
    currentFullAddress: "",
    whatsapp: "",
    relativePhone: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || isPending) {
    return <Loading />;
  }

  const handleInputChange = (
    field: keyof AddressContactData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!userSession?.user?._id) return;

    mutate({
      userId: userSession.user._id as string,
      ...formData,
    });
  };

  const isValidForSubmission = () => {
    return (
      formData.permanentProvince.trim() !== "" &&
      formData.permanentDistrict.trim() !== "" &&
      formData.permanentArea.trim() !== "" &&
      formData.currentProvince.trim() !== "" &&
      formData.currentDistrict.trim() !== "" &&
      formData.currentArea.trim() !== "" &&
      formData.currentFullAddress.trim() !== "" &&
      formData.relativePhone.trim() !== "" &&
      formData.whatsapp.trim() !== ""
    );
  };

  return (
    <section className="relative w-full overflow-hidden py-2">
      {/* Digital Grid Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 dark:bg-[#00A3FF]/5 rounded-full"
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
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Location className="w-5 h-5 text-[#00A3FF]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                    Address & Contact Information
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Provide your permanent and current address details
                </p>
              </div>

              {/* Permanent Residence */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Home className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block font-medium text-gray-900 dark:text-white">
                    Permanent Residence
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={formData.permanentProvince}
                    onChange={(e) =>
                      handleInputChange("permanentProvince", e.target.value)
                    }
                    placeholder="Province"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                  <input
                    value={formData.permanentDistrict}
                    onChange={(e) =>
                      handleInputChange("permanentDistrict", e.target.value)
                    }
                    placeholder="District"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                  <input
                    value={formData.permanentArea}
                    onChange={(e) =>
                      handleInputChange("permanentArea", e.target.value)
                    }
                    placeholder="Area / Village"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                </div>
              </motion.div>

              {/* Current Residence */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Map className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block font-medium text-gray-900 dark:text-white">
                    Current Residence
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={formData.currentProvince}
                    onChange={(e) =>
                      handleInputChange("currentProvince", e.target.value)
                    }
                    placeholder="Province"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                  <input
                    value={formData.currentDistrict}
                    onChange={(e) =>
                      handleInputChange("currentDistrict", e.target.value)
                    }
                    placeholder="District"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                  <input
                    value={formData.currentArea}
                    onChange={(e) =>
                      handleInputChange("currentArea", e.target.value)
                    }
                    placeholder="Area / Village"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    required
                  />
                </div>
              </motion.div>

              {/* Full Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Full Address
                  <span className="text-[#00A3FF] ml-1">*</span>
                </label>
                <textarea
                  value={formData.currentFullAddress}
                  onChange={(e) =>
                    handleInputChange("currentFullAddress", e.target.value)
                  }
                  placeholder="Enter your full current address (street, building, apartment, etc.)"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none"
                  required
                />
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Phone className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block font-medium text-gray-900 dark:text-white">
                    Contact Information
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600 dark:text-gray-400">
                      WhatsApp Number
                    </label>
                    <input
                      value={formData.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      placeholder="e.g., +1234567890"
                      className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                    />
                    <span className="text-xs  text-gray-500 dark:text-gray-400">
                      Add your WhatsApp number, as most of our commination with
                      you will be through the WhatsApp.
                    </span>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600 dark:text-gray-400">
                      Relative Phone Number
                      <span className="text-[#00A3FF] ml-1">*</span>
                    </label>
                    <input
                      value={formData.relativePhone}
                      onChange={(e) =>
                        handleInputChange("relativePhone", e.target.value)
                      }
                      placeholder="e.g., +1234567890"
                      className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                <motion.button
                  type="button"
                  onClick={() => router.back()}
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
                  disabled={!isValidForSubmission() || isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 relative group ${
                    !isValidForSubmission()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
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
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-sm"
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
  );
}
