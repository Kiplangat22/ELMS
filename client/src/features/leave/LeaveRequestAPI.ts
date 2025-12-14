import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

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

export type NewLeaveRequest = Omit<TypeLeaveRequest, 'request_id' | 'employee_id' | 'total_days' | 'status' | 'requested_at'>;

export const leaveRequestAPI = createApi({
  reducerPath: "leaveRequestAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/leave-requests`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LeaveRequests"],
  endpoints: (builder) => ({
    getMyLeaveRequests: builder.query<{ data: TypeLeaveRequest[] }, void>({
      query: () => "/GetLeavReq",
      providesTags: ["LeaveRequests"],
    }),
    createLeaveRequest: builder.mutation<{ data: TypeLeaveRequest }, Partial<TypeLeaveRequest>>({
      query: (data) => ({
        url: "/CreateLeaveReq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    getPendingRequests: builder.query<{ data: TypeLeaveRequest[] }, void>({
      query: () => "/pending",
      providesTags: ["LeaveRequests"],
    }),
    getAllRequests: builder.query<{ data: TypeLeaveRequest[] }, void>({
      query: () => "/leaveReq",
      providesTags: ["LeaveRequests"],
    }),
    getLeaveRequestById: builder.query<{ data: TypeLeaveRequest }, number>({
      query: (id) => `/ReqById/${id}`,
      providesTags: ["LeaveRequests"],
    }),
    approveLeaveRequest: builder.mutation<{ data: TypeLeaveRequest }, number>({
      query: (id) => ({
        url: `/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    rejectLeaveRequest: builder.mutation<{ data: TypeLeaveRequest }, number>({
      query: (id) => ({
        url: `/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
    cancelLeaveRequest: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveRequests"],
    }),
  }),
});

export const {
  useGetMyLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useGetPendingRequestsQuery,
  useGetAllRequestsQuery,
  useGetLeaveRequestByIdQuery,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useCancelLeaveRequestMutation,
} = leaveRequestAPI;
