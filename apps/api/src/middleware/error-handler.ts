import type { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(createHttpError(404, "Route not found"));
}

export function errorHandler(error: Error, _req: Request, res: Response, next: NextFunction) {
  const err = error as HttpError;
  const statusCode = err.statusCode ?? 500;
  void next;
  res.status(statusCode).json({
    error: {
      message: err.message,
      statusCode
    }
  });
}
