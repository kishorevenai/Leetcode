import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password:", password);
  res.status(200).json({ message: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
