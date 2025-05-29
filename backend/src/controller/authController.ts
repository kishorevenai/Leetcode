import { PrismaClient } from "@prisma/client";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

import { User } from "../types/users";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const user = await prisma.user.findUnique({
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },

      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: false,
      //@ts-ignore
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ accessToken, message: "Login successful." });
  } catch (error) {
    return res.status(400).json({ message: "Unauthorised User" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name }: User = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return res
      .status(200)
      .json({ message: "Registration successful.", data: newUser });
  } catch (error) {
    return res.status(400).json({ message: "Unauthorised User" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies;

    if (!cookie || !cookie.token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookie.token;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as string,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const user = await prisma.user.findUnique({
          where: {
            id: (decoded as { id: string }).id,
          },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const accessToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          process.env.ACCESS_TOKEN as string,
          {
            expiresIn: "1h",
          }
        );

        return res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(400).json({ message: "Unauthorised User" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return res.status(400).json({ message: "Unauthorised User" });
  }
};
