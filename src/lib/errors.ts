export type ErrorDetail = { message: string; field: string };

export class AppError extends Error {
  readonly statusCode: number;
  readonly details: ErrorDetail[];

  constructor(
    statusCode: number,
    message: string,
    details: ErrorDetail[] = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
  }
}
