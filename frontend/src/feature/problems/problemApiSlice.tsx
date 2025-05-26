import apiSlice from "../../app/api/apiSlice";

export const problemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProblems: builder.query({
      query: () => ({
        url: "/problems/all_problems",
        method: "GET",
      }),
    }),
    getProblemById: builder.query({
      query: (id) => ({
        url: `/problems/${id}`,
        method: "GET",
      }),
    }),
    submitCode: builder.mutation({
      query: (data) => ({
        url: "/problems/submit",
        method: "POST",
        body: {
          code: data.code,
          language: data.language,
        }, // data should include problemId, userId, and code
      }),
    }),
  }),
});
export const {
  useGetProblemsQuery,
  useGetProblemByIdQuery,
  useSubmitCodeMutation,
} = problemApiSlice;
