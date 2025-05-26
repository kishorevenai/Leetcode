export interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  problemId: string;
  // optionally include the full related Problem if needed
  ProblemDetail?: {
    id: string;
    title: string;
    constraints: string[]; // array of constraints as strings
    difficulty: "EASY" | "MEDIUM" | "HARD";
    starterCode: {
      language: string;
      code: string;
    }; // starter code object
    examples: {
      input: string;
      output: string;
    }[]; // array of example objects
    description: string;
    createdAt: string;
    updatedAt: string;
    userId?: string | null;
  };
  difficulty: "EASY" | "MEDIUM" | "HARD"; // difficulty level
}
