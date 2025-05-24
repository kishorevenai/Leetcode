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
    }),
});
export const {
    useGetProblemsQuery,
    useGetProblemByIdQuery }
    = problemApiSlice;  