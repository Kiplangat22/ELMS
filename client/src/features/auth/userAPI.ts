import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

export type Temployee = {
    // Define your employee fields here
};

export const usersAPI = createApi({
    reducerPath: "usersAPI",   // MUST match store.ts
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
    }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        createUser: builder.mutation<Temployee, Partial<Temployee>>({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const { useCreateUserMutation } = usersAPI;
