export function errorHandler(err, req, res, next) {
  // Duplicate key (e.g. unique email) -> 409 Conflict.
  if (err && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
    });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (statusCode === 500) {
    console.error(err);
  }

  const body = { success: false, message };
  if (err && err.details) {
    body.details = err.details;
  }

  return res.status(statusCode).json(body);
}
