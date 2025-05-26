"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const problemController_1 = require("../controller/problemController");
const router = express_1.default.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post("/create", asyncHandler(problemController_1.createProblem));
router.get("/all_problems", asyncHandler(problemController_1.getAllProblems));
router.get("/:id", asyncHandler(problemController_1.getSpecificProblem));
router.post("/submit", asyncHandler(problemController_1.submitProblem));
exports.default = router;
