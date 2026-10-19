export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (details) {
      this.details = details;
    }
  }
}
