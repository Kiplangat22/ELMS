import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

export type LeaveBalance = {
  balance_id: number;
  employee_id: number;
  balance_days: number;
};

export const leaveBalanceAPI = createApi({
  reducerPath: "leaveBalanceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ApiDomain}/leave-balances`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),

  tagTypes: ["LeaveBalance"],

  endpoints: (builder) => ({

    // GET all balances
    getAllBalances: builder.query<LeaveBalance[], void>({
      query: () => "/",
      providesTags: ["LeaveBalance"],
    }),

    // GET balance by employee_id
    getEmployeeBalance: builder.query<LeaveBalance, number>({
      query: (employee_id) => `/${employee_id}`,
      providesTags: ["LeaveBalance"],
    }),

    // CREATE leave balance
    createLeaveBalance: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveBalance"],
    }),

    // UPDATE leave balance
    updateLeaveBalance: builder.mutation({
      query: ({ balance_id, balance_days }) => ({
        url: `/${balance_id}`,
        method: "PUT",
        body: { balance_days },
      }),
      invalidatesTags: ["LeaveBalance"],
    }),

    // DELETE leave balance
    deleteLeaveBalance: builder.mutation({
      query: (balance_id) => ({
        url: `/${balance_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveBalance"],
    }),

  }),
});

export const {
  useGetAllBalancesQuery,
  useGetEmployeeBalanceQuery,
  useCreateLeaveBalanceMutation,
  useUpdateLeaveBalanceMutation,
  useDeleteLeaveBalanceMutation,
  
} = leaveBalanceAPI;
