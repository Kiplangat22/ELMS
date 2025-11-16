import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";


export type Temployee = {

}

//  User creation
export const usersAPI = createApi ({
    reducePath:'user'
})