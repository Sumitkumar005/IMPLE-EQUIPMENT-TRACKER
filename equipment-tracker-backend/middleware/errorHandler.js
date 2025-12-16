const mongoose = require('mongoose');

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'APPLICATION_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Handle MongoDB duplicate field errors
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

/**
 * Handle MongoDB validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message
  }));

  return new AppError('Invalid input data', 400, 'VALIDATION_ERROR', errors);
};

/**
 * Handle JSON parsing errors
 */
const handleJSONParseError = (err) => {
  return new AppError('Invalid JSON format in request body', 400, 'MALFORMED_REQUEST');
};

/**
 * Handle request timeout errors
 */
const handleTimeoutError = (err) => {
  return new AppError('Request timeout - operation took too long', 408, 'REQUEST_TIMEOUT');
};

/**
 * Handle database connection errors
 */
const handleDatabaseConnectionError = (err) => {
  return new AppError('Database connection failed', 503, 'DATABASE_CONNECTION_ERROR');
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.code,
      message: err.message,
      details: err.details || null,
      stack: err.stack
    }
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || null
      }
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong!'
      }
    });
  }
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_SERVER_ERROR';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.type === 'entity.parse.failed') error = handleJSONParseError(error);
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') error = handleTimeoutError(error);
    if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
      error = handleDatabaseConnectionError(error);
    }

    sendErrorProd(error, res);
  }
};

/**
 * Middleware to handle async errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Middleware to handle 404 errors for undefined routes
 */
const handleNotFound = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'NOT_FOUND');
  next(err);
};

/**
 * Middleware to handle request timeouts
 */
const requestTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeout, () => {
      const err = new AppError('Request timeout', 408, 'REQUEST_TIMEOUT');
      next(err);
    });
    next();
  };
};

/**
 * Middleware to handle malformed JSON requests
 */
const handleMalformedJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const error = new AppError('Invalid JSON format in request body', 400, 'MALFORMED_REQUEST');
    return next(error);
  }
  next(err);
};

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleNotFound,
  requestTimeout,
  handleMalformedJSON
};