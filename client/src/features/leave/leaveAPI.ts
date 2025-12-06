// leaveAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

// Types
export type Leave = {
  id: number;
  type: string;
  reason: string;
  start_date: string;
  end_date: string;
  status: string;
  user_id: number;
};

export type UserLeaves = {
  leaves: Leave[];
};

// API
export const leaveAPI = createApi({
  reducerPath: "leaveAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Leave"],
  endpoints: (builder) => ({
    // Create a new leave
    applyLeave: builder.mutation<Leave, Partial<Leave>>({
      query: (formData) => ({
        url: "/leave/apply",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Leave"],
    }),

    // Get all leaves for current user
    getMyLeaves: builder.query<UserLeaves, void>({
      query: () => "/leave/my-leaves",
      providesTags: ["Leave"],
    }),

    // Get a single leave by ID
    getLeaveById: builder.query<Leave, number>({
      query: (id) => `/leave/${id}`,
      providesTags: ["Leave"],
    }),

    // Update a leave by ID
    updateLeave: builder.mutation<Leave, Partial<Leave> & { id: number }>({
      query: ({ id, ...updatedLeave }) => ({
        url: `/leave/${id}`,
        method: "PUT",
        body: updatedLeave,
      }),
      invalidatesTags: ["Leave"],
    }),

    // Delete a leave by ID
    deleteLeave: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/leave/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leave"],
    }),
  }),
});

// Hooks
export const {
  useApplyLeaveMutation,
  useGetMyLeavesQuery,
  useGetLeaveByIdQuery,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveAPI;
