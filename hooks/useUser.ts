import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  UpdateUserData,
  UserResponse,
  UpdateUserResponse,
  ChangePasswordResponse,
  DeleteUserResponse,
  UploadAvatarResponse,
  ApiErrorResponse,
} from "@/types/user";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const UseGetUser = (id: string) => {
  return useQuery({
    queryKey: ["UseGetUser", id],
    queryFn: async () => {
      try {
        const response = await axios.get<UserResponse>(`/api/user/${id}`);

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Failed to fetch user");
        }

        return response.data.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to fetch user"));
      }
    },
    staleTime: 0,
    enabled: !!id,
    refetchOnWindowFocus: true,
  });
};

// Hook to update user
export const UseUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserData;
    }) => {
      try {
        const response = await axios.put<UpdateUserResponse>(
          `/api/user/${id}`,
          userData,
        );

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Failed to update user");
        }

        return response.data.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to update user"));
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["UseGetUser", variables.id] });
    },
  });
};

// Hook to delete user
export const UseDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await axios.delete<DeleteUserResponse>(`/api/user/${id}`);

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Failed to delete user");
        }

        return response.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to delete user"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UseGetUser"] });
    },
  });
};

// Hook to change password
export const UseChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      id,
      passwordData,
    }: {
      id: string;
      passwordData: ChangePasswordData;
    }) => {
      try {
        const response = await axios.put<ChangePasswordResponse>(
          `/api/user/${id}/change-password`,
          passwordData,
        );

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Failed to change password");
        }

        return response.data;
      } catch (error) {
        throw new Error(
          getApiErrorMessage(error, "Failed to change password"),
        );
      }
    },
  });
};

export const UseUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await axios.post<UploadAvatarResponse>(
          `/api/user/${id}/avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Failed to upload avatar");
        }

        return response.data.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Failed to upload avatar"));
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["UseGetUser", variables.id] });
    },
  });
};
