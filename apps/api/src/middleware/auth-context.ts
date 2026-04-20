import type { Request, Response, NextFunction } from "express";

export type AuthContext = {
  userId: string | null;
  role: "anonymous" | "authenticated";
};

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      auth: AuthContext;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function authContext(req: Request, _res: Response, next: NextFunction) {
  const userId = req.header("x-user-id") ?? null;
  req.auth = {
    userId,
    role: userId ? "authenticated" : "anonymous"
  };
  next();
}
