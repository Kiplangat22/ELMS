import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";


export type TypeDepartment = {
  departmentid: number;
  department_name: string;
  description: string;
};

export const departmentAPI = createApi({
  reducerPath: "departmentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Departments"],
  endpoints: (builder) => ({
    getDepartments: builder.query<{ data: TypeDepartment[] }, void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
    createDepartment: builder.mutation<{ data: TypeDepartment }, Partial<TypeDepartment>>({
      query: (data) => ({
        url: "/departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation<{ data: TypeDepartment }, { id: number; data: Partial<TypeDepartment> }>({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentAPI;