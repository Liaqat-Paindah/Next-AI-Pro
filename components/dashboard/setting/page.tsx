"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  UserCircle,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import {
  UseGetUser,
  UseUpdateUser,
  UseDeleteUser,
  UseChangePassword,
  UseUploadAvatar,
} from "@/hooks/useUser";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface UserInfoProps {
  isEditable?: boolean;
}

const UserInfo = ({ isEditable = true }: UserInfoProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?._id;
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { data: user, isLoading, error, refetch } = UseGetUser(userId || "");
  const updateUserMutation = UseUpdateUser();
  const deleteUserMutation = UseDeleteUser();
  const changePasswordMutation = UseChangePassword();
  const uploadAvatarMutation = UseUploadAvatar();

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
  };

  const buildFileUrl = (filePath?: string | null) => {
    if (!filePath) return null;
    if (/^https?:\/\//i.test(filePath)) return filePath;

    const baseUrl = process.env.NEXT_PUBLIC_FILE_URL;
    if (!baseUrl) {
      return filePath.startsWith("/") ? filePath : `/${filePath}`;
    }

    const safeBase = baseUrl.replace(/\/+$/, "");
    const safePath = filePath.replace(/^\/+/, "");
    return `${safeBase}/${safePath}`;
  };

  const avatarUrl = buildFileUrl(user?.avatar);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
      });
      setAvatarError(false); // Reset avatar error when user data loads
    }
  }, [user]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!userId) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        userData: formData,
      });
      setIsEditing(false);
      refetch(); 
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        id: userId,
        passwordData: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to change password. Please check your current password.",
        ),
      );
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Avatar file size must be less than 10MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      await uploadAvatarMutation.mutateAsync({
        id: userId,
        file,
      });
      setAvatarError(false); 
      refetch();
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to upload avatar"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(userId);
      toast.success("Account deleted successfully");
      // Redirect to home or login page
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete account"));
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 rounded-sm border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <Shield className="w-5 h-5" />
          <p className="text-sm font-medium">
            Failed to load user information. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full p-6 text-center">
        <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No User Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User data not available.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-transparent rounded-sm overflow-hidden border border-gray-200 dark:border-white/10"
    >
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                User Information
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Personal details and account information
              </p>
            </div>
          </div>

          {isEditable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
            >
              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit Profile
            </button>
          )}

          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm hover:shadow-lg hover:shadow-[#00A3FF]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl && !avatarError ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                unoptimized
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-gray-200 dark:border-white/10 object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {getInitials()}
                </span>
              </div>
            )}
            {isEditable && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                disabled={uploadingAvatar}
              >
                <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <input
              ref={avatarInputRef}
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAvatarUpload(file);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </span>
            </div>
            {uploadingAvatar && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Uploading avatar...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00A3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Full Name
              </p>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00A3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Email Address
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                {user.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00A3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Phone Number
              </p>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.phone || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00A3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Member Since
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#00A3FF]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
          >
            {showPasswordSection ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF]"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm hover:shadow-lg hover:shadow-[#00A3FF]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </button>
              <button
                onClick={() => setShowPasswordSection(false)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Account Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-red-100 dark:bg-red-900/20">
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Delete Account
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteSection(!showDeleteSection)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
          >
            {showDeleteSection ? "Cancel" : "Delete Account"}
          </button>
        </div>

        {showDeleteSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Warning: This action cannot be undone
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Deleting your account will permanently remove all your data,
                  including applications, scholarships, and profile information.
                  This action is irreversible.
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteUserMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteUserMutation.isPending
                      ? "Deleting..."
                      : "Delete Account"}
                  </button>
                  <button
                    onClick={() => setShowDeleteSection(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserInfo;
