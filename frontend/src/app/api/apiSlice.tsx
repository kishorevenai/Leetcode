import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../feature/auth/authSlice";

export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      const accessToken = (refreshResult.data as { accessToken?: string })?.accessToken;
      if (accessToken) {
        api.dispatch(setCredentials(accessToken));
      }

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        // Handle unauthorized access, e.g., redirect to login
        if (refreshResult.error && typeof refreshResult.error.data === "object" && refreshResult.error.data !== null) {
          (refreshResult.error.data as { message?: string }).message = "Your Login has expired"; // Set to 401 to indicate unauthorized
        }
      }
      return refreshResult; // Return the error from the refresh query
    }
  }

  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: [],
});

export default apiSlice;
