import express from "express";
import {
  createProblem,
  getAllProblems,
  getSpecificProblem,
  submitProblem,
} from "../controller/problemController";

const router = express.Router();

const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/create", asyncHandler(createProblem));
router.get("/all_problems", asyncHandler(getAllProblems));
router.get("/:id", asyncHandler(getSpecificProblem));
router.post("/submit", asyncHandler(submitProblem));

export default router;
