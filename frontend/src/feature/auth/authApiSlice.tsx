import apiSlice from "../../app/api/apiSlice";
import { setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data as { accessToken: string };
          if (accessToken) {
            dispatch(setCredentials({ accessToken }));
          }

        } catch (error) {
          console.error("Failed to refresh token:", error);
        }
      },
    }),
  })
})

export const { useLoginMutation, useRefreshMutation } = authApiSlice;
