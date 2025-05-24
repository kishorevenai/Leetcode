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
exports.getAllProblems = exports.createProblem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProblem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, difficulty } = req.body;
        if (!title || !description || !difficulty) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const newProblem = yield prisma.problem.create({
            data: {
                title,
                difficulty,
                description,
            },
        });
        res
            .status(201)
            .json({ message: "Problem created successfully", problem: newProblem });
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
