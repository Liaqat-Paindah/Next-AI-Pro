export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  field?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UploadAvatarResponse {
  success: boolean;
  data: User;
  message: string;
}
