export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const badRequest = (message: string, code = "BAD_REQUEST") =>
  new AppError(400, code, message);

export const unauthorized = (message = "Not authenticated") =>
  new AppError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "Not allowed") =>
  new AppError(403, "FORBIDDEN", message);

export const notFound = (message: string) =>
  new AppError(404, "NOT_FOUND", message);

export const conflict = (message: string, code = "CONFLICT") =>
  new AppError(409, code, message);
