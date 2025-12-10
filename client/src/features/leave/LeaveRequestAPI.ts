import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TypeLeaveRequest = {
  request_id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  justification: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  requested_at: string;
};

export type NewLeaveRequest = {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  justification: string;
};

export const leaveRequestAPI = createApi({
  reducerPath: "leaveRequestAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LeaveRequests"],
  endpoints: (builder) => ({
    applyLeave: builder.mutation<{ data: TypeLeaveRequest }, NewLeaveRequest>({
      query: (data) => ({
        url: "/leave-request/CreateLeaveReq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    getMyLeaveRequests: builder.query<{ data: TypeLeaveRequest[] }, void>({
      query: () => "/leave-request/GetLeavReq",
      providesTags: ["LeaveRequests"],
    }),
    cancelLeaveRequest: builder.mutation<void, number>({
      query: (request_id) => ({
        url: `/leave-request/${request_id}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    getAllLeaveRequests: builder.query<{ data: TypeLeaveRequest[] }, void>({
      query: () => "/leave-request/all",
      providesTags: ["LeaveRequests"],
    }),
    approveLeaveRequest: builder.mutation<void, number>({
      query: (request_id) => ({
        url: `/leave-request/${request_id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    rejectLeaveRequest: builder.mutation<void, number>({
      query: (request_id) => ({
        url: `/leave-request/${request_id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
  }),
});

export const {
  useApplyLeaveMutation,
  useGetMyLeaveRequestsQuery,
  useCancelLeaveRequestMutation,
  useGetAllLeaveRequestsQuery,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
} = leaveRequestAPI;