import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface CreateProblemRequest extends Request {}

interface CreateProblemResponse extends Response {}

export const createProblem = async (
  req: CreateProblemRequest,
  res: CreateProblemResponse
): Promise<void> => {
  try {
    const { title, description, difficulty } = req.body;

    if (!title || !description || !difficulty) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        difficulty,
        description,
      },
    });
    res
      .status(201)
      .json({ message: "Problem created successfully", problem: newProblem });
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
