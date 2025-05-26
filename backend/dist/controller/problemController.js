"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitProblem = exports.getSpecificProblem = exports.getAllProblems = exports.createProblem = void 0;
const client_1 = require("@prisma/client");
const RedisController_1 = require("../Redis/RedisController");
const prisma = new client_1.PrismaClient();
const createProblem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, difficulty, constraints, examples, starterCode, } = req.body;
        if (!title ||
            !description ||
            !difficulty ||
            !constraints ||
            !examples ||
            !starterCode) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newProblem = yield tx.problem.create({
                data: {
                    title,
                    difficulty,
                },
            });
            const problemDetail = yield tx.problemDetail.create({
                data: {
                    constraints,
                    examples,
                    description,
                    starterCode,
                    problemId: newProblem.id,
                },
            });
            return { newProblem, problemDetail };
        }));
        res.status(201).json({
            message: "Problem and details created successfully",
            problem: result.newProblem,
            detail: result.problemDetail,
        });
    }
    catch (error) {
        console.log("Error creating problem:", error);
        res.status(500).json({ error: "Failed to create problem" });
    }
});
exports.createProblem = createProblem;
const getAllProblems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problems = yield prisma.problem.findMany();
        res.status(200).json(problems);
    }
    catch (error) {
        console.log("Error fetching problems:", error);
        res.status(500).json({ error: "Failed to fetch problems" });
    }
});
exports.getAllProblems = getAllProblems;
const getSpecificProblem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const problem = yield prisma.problem.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching specific problem:", error);
        return res.status(500).json({ error: "Failed to fetch problem" });
    }
});
exports.getSpecificProblem = getSpecificProblem;
const submitProblem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, language } = req.body;
        const result = yield RedisController_1.RedisController.getInstance().sendAndAwait({
            code,
            language,
        });
        return res
            .status(200)
            .json({ message: "Submission problems fetched successfully" });
    }
    catch (error) {
        console.error("Error submitting problem:", error);
        return res.status(500).json({ error: "Failed to submit problem" });
    }
});
exports.submitProblem = submitProblem;
