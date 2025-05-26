import type React from "react";
import { useGetProblemsQuery } from "../../../feature/problems/problemApiSlice";
import { useNavigate } from "react-router-dom";

// Define the Problem type if not already imported
type Problem = {
  id: string;
  title: "Zigzag Conversion";
  difficulty: "MEDIUM";
  description: "Solve this problem using the hashmap method";
  createdAt: "2025-05-24T17:24:50.899Z";
  updatedAt: "2025-05-24T17:24:50.899Z";
  userId: null;
};

const AllProblems = () => {
  const navigate = useNavigate();

  const {
    data: problems,
    isLoading,
    isError,
    error,
  } = useGetProblemsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const HandleRouteSpecificProblem = (id: string) => {
    navigate(`/problems/${id}`);
  };

  const getDifficultyStyle = (difficulty: string): React.CSSProperties => {
    switch (difficulty) {
      case "EASY":
        return {
          color: "#237804", // dark green
          backgroundColor: "#d9f7be", // light green background
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: "600",
          fontSize: "10px",
          margin: "0 5px",
          display: "inline-block",
        };
      case "MEDIUM":
        return {
          color: "#ad8b00", // dark yellow/orange
          backgroundColor: "#fff7ba", // light yellow background
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: "600",
          fontSize: "10px",
          margin: "0 5px",
          display: "inline-block",
        };
      case "HARD":
        return {
          color: "#a8071a", // dark red
          backgroundColor: "#ffa39e", // light red background
          padding: "2px 6px",
          borderRadius: "4px",
          fontWeight: "600",
          fontSize: "10px",
          margin: "0 5px",
          display: "inline-block",
        };
      default:
        return {};
    }
  };

  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    let errorMessage = "An error occurred";
    if (error && typeof error === "object") {
      if ("message" in error && typeof error.message === "string") {
        errorMessage = error.message;
      } else if ("status" in error) {
        errorMessage = `Error status: ${error.status}`;
      }
    }
    content = <div>Error: {errorMessage}</div>;
  } else {
    content = (
      <div>
        {problems.map(
          (problem: Problem, index: number): React.ReactNode => (
            <div
              key={problem.id}
              onClick={() => HandleRouteSpecificProblem(problem.id)}
              style={{
                borderRadius: "5px",
                marginBottom: "5px",
              }}
              className="flex hover:border-2 duration-10 justify-between items-center"
              key={problem.id}
            >
              <div
                style={{}}
                className="flex w-2/6 justify-start items-center p-4"
              >
                <p
                  style={{
                    margin: "0 5px 0 5px",
                    fontSize: "10px",
                  }}
                >
                  {index}.
                </p>
                <h3
                  style={{
                    fontSize: "10px",
                  }}
                >
                  {problem.title}
                </h3>
              </div>
              <div style={getDifficultyStyle(problem.difficulty)}>
                {problem.difficulty}
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  return <div>{content}</div>;
};

export default AllProblems;
