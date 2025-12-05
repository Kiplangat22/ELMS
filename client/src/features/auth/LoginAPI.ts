// src/features/auth/loginAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";

// Define the type for the response from the login endpoint
export type TLoginResponse = {
    token: string;
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    };
}

// Define the input type for login
type LoginInputs = {
    email: string;
    password: string;
}

// Create the API slice
export const loginAPI = createApi({
    reducerPath: 'loginAPI', // unique key for the store
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginInputs>({
            query: (loginData) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login'] // invalidate cached data if needed
        })
    })
});

// Export hooks for usage in functional components
export const { useLoginUserMutation } = loginAPI;
