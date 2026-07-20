export class ApiError extends Error {
  constructor(statusCode, code, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const Errors = {
  badRequest: (message, details) => new ApiError(400, "BAD_REQUEST", message, details),
  notFound: (message) => new ApiError(404, "NOT_FOUND", message),
  conflict: (message) => new ApiError(409, "CONFLICT", message),
  internal: (message) => new ApiError(500, "INTERNAL_ERROR", message),
};

// Wraps async route handlers so thrown errors/rejected promises reach the
// centralized error middleware instead of crashing the process.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Centralized Express error-handling middleware. Every error in the app,
// expected or not, is normalized into one consistent JSON shape.
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = statusCode === 500 ? "Something went wrong on our end." : err.message;

  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error("[unhandled error]", err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: `No route for ${req.method} ${req.originalUrl}` },
  });
}
