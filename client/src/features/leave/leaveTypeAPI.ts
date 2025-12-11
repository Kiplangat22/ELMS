import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
// import type { RootState } from "../../app/store";

export type TypeLeaveType = {
  leavetypeid: number;
  leave_name: string;
  description: string;
  max_days: number;
};

export const leaveTypeAPI = createApi({
  reducerPath: "leaveTypeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LeaveTypes"],
  endpoints: (builder) => ({
    getLeaveTypes: builder.query<{ data: TypeLeaveType[] }, void>({
      query: () => "/leave-types",
      providesTags: ["LeaveTypes"],
    }),
    createLeaveType: builder.mutation<{ data: TypeLeaveType }, Partial<TypeLeaveType>>({
      query: (data) => ({
        url: "/leave-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveTypes"],
    }),
    updateLeaveType: builder.mutation<{ data: TypeLeaveType }, { id: number; data: Partial<TypeLeaveType> }>({
      query: ({ id, data }) => ({
        url: `/leave-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveTypes"],
    }),
    deleteLeaveType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/leave-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveTypes"],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} = leaveTypeAPI;