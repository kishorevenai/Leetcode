import express from "express";
import { login, register } from "../controller/authController";

const router = express.Router();

const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.route("/login").post(asyncHandler(login));
router.route("/register").post(asyncHandler(register));

export default router;
