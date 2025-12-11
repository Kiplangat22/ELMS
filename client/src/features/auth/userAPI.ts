// usersAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";
import { ApiDomain } from "../../utils/ApiDomain";

// User Type
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

// API Slice
export const usersAPI = createApi({
    reducerPath: 'usersAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = (state as any).user?.token || null;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Users'],

    endpoints: (builder) => ({

        // REGISTER
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (user) => ({
                url: '/auth/register',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),

        // VERIFY
        verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
            query: (payload) => ({
                url: '/auth/verify',
                method: 'POST',
                body: payload,
            }),
        }),

        // LOGIN (OPTIONAL BUT STANDARD)
        loginUser: builder.mutation<{ token: string; user: TUser }, { email: string; password: string }>({
            query: (payload) => ({
                url: '/auth/login',
                method: 'POST',
                body: payload,
            }),
        }),

        // GET ALL USERS
        getUsers: builder.query<TUser[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),

        // GET USER BY ID
        getUserById: builder.query<TUser, number>({
            query: (id) => `/users/${id}`,
        }),

        // UPDATE USER
        updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
            query: (user) => ({
                url: `/users/${user.id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),

        // DELETE USER
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

    }),
});

export const {
    useCreateUsersMutation,
    useVerifyUserMutation,
    useLoginUserMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersAPI;
