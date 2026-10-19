import { AppError } from '../utils/AppError.js';

// Validates req[source] against a Zod schema and replaces it with parsed data.
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new AppError('Validation failed', 400, details));
    }
    req[source] = result.data;
    return next();
  };
}
