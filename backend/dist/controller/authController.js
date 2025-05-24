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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.register = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and Password are required." });
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        console.log("==========>", user);
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        if (!user.password) {
            return res.status(400).json({ message: "Invalid password." });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.REFRESH_TOKEN, {
            expiresIn: "1d",
        });
        res.cookie("token", refreshToken, {
            httpOnly: true,
            secure: false,
            //@ts-ignore
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
        });
        return res.status(200).json({ accessToken, message: "Login successful." });
    }
    catch (error) {
        return res.status(400).json({ message: "Unauthorised User" });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and Password are required." });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const newUser = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
        return res
            .status(200)
            .json({ message: "Registration successful.", data: newUser });
    }
    catch (error) {
        return res.status(400).json({ message: "Unauthorised User" });
    }
});
exports.register = register;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies;
        if (!cookie || !cookie.token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const refreshToken = cookie.token;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            const user = yield prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const accessToken = jsonwebtoken_1.default.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }, process.env.ACCESS_TOKEN, {
                expiresIn: "1h",
            });
            return res.status(200).json({ accessToken });
        }));
    }
    catch (error) {
        return res.status(400).json({ message: "Unauthorised User" });
    }
});
exports.refresh = refresh;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        return res.status(200).json({ message: "Logout successful." });
    }
    catch (error) {
        return res.status(400).json({ message: "Unauthorised User" });
    }
});
exports.logout = logout;
