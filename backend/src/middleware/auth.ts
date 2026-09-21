import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

export interface UserPayload {
  id: string;
  role: string;
}

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
}

export const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization as string | undefined;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user;
    next();
  });
};