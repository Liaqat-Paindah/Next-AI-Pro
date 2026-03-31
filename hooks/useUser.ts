import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UpdateUserData, UserResponse, UpdateUserResponse } from "@/types/user";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const UseGetUser = (id: string) => {
  return useQuery({
    queryKey: ["UseGetUser", id],
    queryFn: async () => {
      console.log("the user id is", id);
      const response = await axios.get<UserResponse>(`/api/user/${id}`);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Failed to fetch user");
      }

      return response.data.data;
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
      const response = await axios.put<UpdateUserResponse>(
        `/api/user/${id}`,
        userData,
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Failed to update user");
      }

      return response.data.data;
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
      const response = await axios.delete(`/api/user/${id}`);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Failed to delete user");
      }

      return response.data;
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
      const response = await axios.put(`/api/user/${id}/change-password`, passwordData);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Failed to change password");
      }

      return response.data;
    },
  });
};
