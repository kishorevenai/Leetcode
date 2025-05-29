import express from "express";
import { login, register, refresh, logout } from "../controller/authController";

const router = express.Router();

const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.route("/login").post(asyncHandler(login));
router.route("/logout").post(asyncHandler(logout));
router.route("/register").post(asyncHandler(register));
router.route("/refresh").get(asyncHandler(refresh));

export default router;
