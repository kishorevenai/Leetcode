import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
const app = express();

dotenv.config();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
