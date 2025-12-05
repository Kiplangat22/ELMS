// usersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { ApiDomain } from "../../utils/ApiDomain";

// Define the User type
export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
    role?: string;
    isVerified: boolean;
    password?: string;
    image_url?: string;
};

// Create the API slice
export const usersAPI = createApi({
    reducerPath: 'usersAPI', // key in the store
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = (state as any).user?.token || '';
            if (token) headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Users'], // for cache invalidation
    endpoints: (builder) => ({
        // Register/Create user
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (user) => ({
                url: '/auth/register',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),

        // Verify user
        verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
            query: (data) => ({
                url: '/auth/verify',
                method: 'POST',
                body: data,
            }),
        }),

        // Get all users
        getUsers: builder.query<TUser[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),

        // Get single user by ID
        getUserById: builder.query<TUser, number>({
            query: (id) => `/user/${id}`,
        }),

        // Update user
        updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
            query: (user) => ({
                url: `/user/${user.id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

// Export hooks to use in components
export const {
    useCreateUsersMutation,
    useVerifyUserMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation
} = usersAPI;
