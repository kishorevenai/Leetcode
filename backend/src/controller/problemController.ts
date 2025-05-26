import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RedisController } from "../Redis/RedisController";

const prisma = new PrismaClient();
interface CreateProblemRequest extends Request {}

interface CreateProblemResponse extends Response {}

export const createProblem = async (
  req: CreateProblemRequest,
  res: CreateProblemResponse
): Promise<void> => {
  try {
    const {
      title,
      description,
      difficulty,
      constraints,
      examples,
      starterCode,
    } = req.body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !constraints ||
      !examples ||
      !starterCode
    ) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const newProblem = await tx.problem.create({
        data: {
          title,
          difficulty,
        },
      });

      const problemDetail = await tx.problemDetail.create({
        data: {
          constraints,
          examples,
          description,
          starterCode,
          problemId: newProblem.id,
        },
      });

      return { newProblem, problemDetail };
    });

    res.status(201).json({
      message: "Problem and details created successfully",
      problem: result.newProblem,
      detail: result.problemDetail,
    });
  } catch (error) {
    console.log("Error creating problem:", error);
    res.status(500).json({ error: "Failed to create problem" });
  }
};

export const getAllProblems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const problems = await prisma.problem.findMany();
    res.status(200).json(problems);
  } catch (error) {
    console.log("Error fetching problems:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

export const getSpecificProblem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        ProblemDetail: true, // include the associated detail
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    console.log("CHECKING PROBLEM", problem);

    return res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching specific problem:", error);
    return res.status(500).json({ error: "Failed to fetch problem" });
  }
};

export const submitProblem = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    const result = await RedisController.getInstance().sendAndAwait({
      code,
      language,
    });

    return res
      .status(200)
      .json({ message: "Submission problems fetched successfully" });
  } catch (error) {
    console.error("Error submitting problem:", error);
    return res.status(500).json({ error: "Failed to submit problem" });
  }
};
