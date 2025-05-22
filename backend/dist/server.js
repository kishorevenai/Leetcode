"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log("Email:", email);
    console.log("Password:", password);
    res.status(200).json({ message: "Hello World!" });
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
