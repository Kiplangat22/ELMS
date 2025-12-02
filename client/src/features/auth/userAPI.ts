import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";


export type Temployee = {


}

//  User creation
export const usersAPI = createApi ({
    reducerPath:'userAPI',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        createUser: builder.mutation <Temployee, Partial<Temployee>> ({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
})